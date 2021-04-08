const jwt = require("jsonwebtoken");

import { db, firebase } from "../fbadim/fb-hook";
const getErrorMessage = () => {
  let respone = {
    success: false,
    message: "Some field is missing or Invalid in the request",
  };
  return respone;
};

module.exports.checkadmin = async (req, res, next) => {
  const token = req.token;
  if (!token) {
    res.status(403).json(getErrorMessage());
    return;
  }

  try {
    const claims = await firebase.auth().verifyIdToken(token);
    if (claims.admin === true) {
      next();
    } else {
      res.status(403).json({
        status: false,
        message: err,
      });
    }
  } catch (err) {
    res.status(403).json({
      status: false,
      message: err,
    });
  }
};

module.exports.refreshTokenMidleware = async (req, res, next) => {
  const { oldtoken, auth, deviceID } = req.body;
  if (!oldtoken || !auth || !deviceID) {
    res.json(getErrorMessage());
    return;
  }
  console.log(oldtoken);
  try {
    const decode = await jwt.verify(oldtoken, process.env.SECRECTJWT);
    console.log(decode);
    db.collection("deviceTokens")
      .where("bcIdentity", "==", decode)
      .get()
      .then((docs) => {
        if (docs.size == 1) {
          docs.forEach((info) => {
            if (
              info.data().auth === auth &&
              info.data().deviceID === deviceID
            ) {
              console.log(info.data());
              console.log(info.id);
              req.body.docId = info.id;
              req.body.bcIdentity = decode;
              next();
            }
          });
        } else {
          res.status(403).json({ success: false, message: "Token invalid" });
        }
      })
      .catch((err) => {
        res.status(403).json({ success: false, message: err.message });
      });
  } catch (err) {
    console.log(err.message);
    res.status(403).json({ success: false, message: err.message });
  }
};
