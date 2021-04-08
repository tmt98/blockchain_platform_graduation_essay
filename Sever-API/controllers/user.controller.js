const jwt = require("jsonwebtoken");
const log4js = require("log4js");
const logger = log4js.getLogger("APP.JS");
const helper = require("../helper/helper");
const constants = require("../config/constans.json");
const { randomBytes } = require("crypto");
const dotenv = require("dotenv");
import { db, firebase } from "../fbadim/fb-hook";
import { sendmail } from "../mailer/mailer";
dotenv.config();
const getErrorMessage = () => {
  let respone = {
    success: false,
    message: "Some field is missing or Invalid in the request",
  };
  return respone;
};
module.exports.updatePhoneNumber = async (req, res) => {
  const { uid, phoneNumber } = req.body;
  if (!uid || !phoneNumber) {
    res.status(403).json(getErrorMessage());
    return;
  }

  try {
    const user = await firebase
      .auth()
      .updateUser(uid, { phoneNumber: phoneNumber });
    console.log(user);
    res.json({
      status: true,
      message: "Update phone Number success",
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({
      status: false,
      message: err.message,
    });
  }
};

module.exports.adddevice = async (req, res) => {
  const { uid, name, infoDevice, email } = req.body;
  if (!uid || !name || !infoDevice || !email) {
    res.status(403).json(getErrorMessage());
    return;
  }
  try {
    const { id } = await db.collection("devices").add({
      ...infoDevice,
      actived: false,
      auth: uid,
      email: email,
      refUser: [],
      date: new Date().toLocaleString(),
    });

    const text = `Chào anh tài bđ cho em thêm máy mới nghe hihi!!!\nUID: ${uid}\nDeviceID: ${id}`;
    sendmail(name, "iot.blockchain.2020@gmail.com", text);
    res.json({
      status: true,
      message: "add device completed",
    });
  } catch (err) {
    console.log("Loi roi : ", err);
    res.status(403).json({
      status: false,
      message: err.message,
    });
  }
};

module.exports.registerEnrollNewUser = async (req, res) => {
  const { deviceID, sensors, auth, uid, deviceInfo } = req.body;

  if (!deviceID || !sensors || !auth || !uid || !deviceInfo) {
    res.status(401).json(getErrorMessage());
    return;
  }
  const username = randomBytes(20).toString("hex");
  try {
    let response = await helper.getRegisterUser1(
      username,
      process.env.ORGREADER,
      deviceID,
      deviceInfo,
      sensors
    );
    if (response && typeof response !== "string") {
      logger.debug(
        "Successfully registered the username %s for organization %s",
        username,
        process.env.ORGREADER
      );
      const doc = {
        provider: uid,
        auth: auth,
        deviceID: deviceID,
        bcIdentity: username,
        revoke: false,
      };
      let sensorscut = [];
      for (let ss of sensors) {
        if (ss.share === true) sensorscut.push(ss);
      }
      const docref = {
        auth: auth,
        deviceID: deviceID,
        data_fields: sensorscut,
      };
      await db.collection("fieldRef").add(docref);
      await db.collection("bcAccounts").add(doc);
      await db
        .collection("devices")
        .doc(deviceID)
        .update({
          refUser: firebase.firestore.FieldValue.arrayUnion(auth),
        });
      res.json({ status: true, message: response });
    } else {
      res.status(401).json({ success: false, message: response });
    }
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: err.message });
  }
};

module.exports.updateSharefield = async (req, res) => {
  const { auth, deviceID, sensors } = req.body;
  if (!auth || !deviceID || !sensors) {
    res.status(401).json(getErrorMessage());
    return;
  }
  try {
    let identity = "";
    await db
      .collection("bcAccounts")
      .where("auth", "==", auth)
      .where("deviceID", "==", deviceID)
      .get()
      .then((doc) => {
        if (doc.size > 0) {
          doc.forEach((elem) => {
            console.log("co user");
            identity = elem.data().bcIdentity;
            console.log(elem.data());
          });
        } else {
          res
            .status(401)
            .json({ success: false, message: "Uuser Account does not exits" });
          return;
        }
      })
      .catch((err) => {
        res.status(401).json({ success: false, message: err.message });
        return;
      });
    console.log(identity);
    const ressponeupdate = await helper.updateShareField(identity, sensors);
    if (ressponeupdate && typeof ressponeupdate !== "string") {
      await db
        .collection("fieldRef")
        .where("auth", "==", auth)
        .where("deviceID", "==", deviceID)
        .get()
        .then((doc) => {
          doc.forEach((elem) => {
            console.log(elem.id);
            let sensorscut = [];
            for (let ss of sensors) {
              if (ss.share === true) sensorscut.push(ss);
            }
            db.collection("fieldRef").doc(elem.id).update({
              data_fields: sensorscut,
            });
          });
          res.json({ success: true, message: "Update success" });
        })
        .catch((err) => {
          res.status(401).json({ success: false, message: err.message });
        });
    } else {
      res.status(401).json({ success: false, message: ressponeupdate });
    }
  } catch (err) {
    console.log(err.message);
    res.status(401).json({ success: false, message: err.message });
    return;
  }
};

module.exports.getToken = async (req, res) => {
  const { body } = req;
  const { bcIdentity, uid, deviceID } = body;
  logger.debug("Username: " + bcIdentity);
  if (!bcIdentity || !uid || !deviceID) {
    res.status(401).json(getErrorMessage());
    return;
  }

  let isUserRegistered = await helper.isUserRegistered(
    bcIdentity,
    process.env.ORGREADER
  );

  if (isUserRegistered) {
    const token = jwt.sign(
      {
        exp:
          Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expresstime),
        bcIdentity: bcIdentity,
        uid: uid,
        deviceID: deviceID,
      },
      process.env.SECRECTJWT
    );

    res.json({
      success: true,
      token: token,
    });
  } else {
    // res.json({
    //   success: false,
    //   message: `${username} is not registered with ${orgName} on channel ${channel}`,
    // });
    console.log("loi ne");
    res.status(401).json({
      message: "user does not exist",
    });
  }
};

module.exports.getRefUser = async (req, res) => {
  const { refUsers, deviceID } = req.body;
  logger.debug("Username: " + refUsers);
  if (!refUsers) {
    res.status(401).json(getErrorMessage());
    return;
  }

  try {
    const usersid = await refUsers.map((uid) => {
      return { uid: uid };
    });

    const { users } = await firebase.auth().getUsers(usersid);
    // console.log(users)

    const usersInfo = await users.map((info) => {
      //    console.log(info.displayName)
      return {
        uid: info.uid,
        displayName: info.displayName,
        email: info.email,
        phoneNumber: info.phoneNumber,
      };
    });
    console.log(usersInfo);
    res.json({
      success: true,
      users: usersInfo,
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.getField = async (req, res) => {
  const { auth, provider, deviceID } = req.body;

  if (!auth || !provider | deviceID) {
    res.status(401).json(getErrorMessage());
    return;
  }
  db.collection("bcAccounts")
    .where("auth", "==", auth)
    .where("deviceID", "==", deviceID)
    .where("provider", "==", provider)
    .get()
    .then((snapshot) => {
      if (snapshot.size > 0) {
        snapshot.forEach(async (doc) => {
          const bcIdentity = doc.data().bcIdentity;
          try {
            const attrs = await helper.getAttrsUSer(bcIdentity);
            const attrFiled = attrs.find((item) => item.name == "refField");
            console.log(attrFiled);
            res.json({ success: true, data: JSON.parse(attrFiled.value) });
          } catch (error) {
            console.log(error);
            res.status(401).json({
              success: false,
              message: error.message,
            });
          }
        });
      } else {
        res.status(401).json({
          success: false,
          message: "no permission",
        });
        return;
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(401).json({
        success: false,
        message: err.message,
      });
    });
};

module.exports.rovokeUser = async (req, res) => {
  const { auth, provider, deviceID } = req.body;

  if (!auth || !provider | deviceID) {
    res.status(401).json(getErrorMessage());
    return;
  }
  db.collection("bcAccounts")
    .where("auth", "==", auth)
    .where("deviceID", "==", deviceID)
    .where("provider", "==", provider)
    .get()
    .then((snapshot) => {
      if (snapshot.size > 0) {
        snapshot.forEach(async (doc) => {
          const id = doc.id;
          const bcIdentity = doc.data().bcIdentity;
          try {
            const response = await helper.revokeUser(
              bcIdentity,
              process.env.ORGREADER
            );
            if (response && typeof response !== "string") {
              await db.collection("bcAccounts").doc(id).delete();
              await db
                .collection("devices")
                .doc(deviceID)
                .update({
                  refUser: firebase.firestore.FieldValue.arrayRemove(auth),
                });
              res.json({ success: true, message: "success revoke user" });
            }
          } catch (error) {
            console.log(error);
            res.status(401).json({
              success: false,
              message: error.message,
            });
          }
        });
      } else {
        res.status(401).json({
          success: false,
          message: "no permission",
        });
        return;
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(401).json({
        success: false,
        message: err.message,
      });
    });
};
