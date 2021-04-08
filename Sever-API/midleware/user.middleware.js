import { db, firebase } from "../fbadim/fb-hook";

const getErrorMessage = () => {
  let respone = {
    success: false,
    message: "Some field is missing or Invalid in the request",
  };
  return respone;
};

module.exports.verifytoken = async (req, res, next) => {
  const token = req.token;
  if (!token) {
    res.status(403).json(getErrorMessage());
    return;
  }
  try {
    const { uid, name, email } = await firebase.auth().verifyIdToken(token);
    req.body.uid = uid;
    req.body.email = email;
    req.body.name = name;
    next();
  } catch (err) {
    console.log("Error: " + err);
    res.status(403).json({
      status: false,
      message: err.message,
    });
  }
};

module.exports.verifyOnwer = async (req, res, next) => {
  const token = req.token;
  const { deviceID } = req.body;
  if (!token || !deviceID) {
    res.status(401).json(getErrorMessage());
    return;
  }

  console.log("do verify owner ne he");
  try {
    const { uid } = await firebase.auth().verifyIdToken(token);
    const docs = db.collection("devices").doc(deviceID);

    docs.get().then(async (doc) => {
      if (
        doc.exists &&
        doc.data().auth === uid &&
        doc.data().actived === true
      ) {
        console.log("next");
        req.body.provider = uid;
        next();
        // try {
        //     const userRecord = await firebase.auth().getUserByEmail(shareAccount)
        //     console.log(userRecord.uid)
        //     req.body.auth = userRecord.uid;
        //     next();
        // } catch (err) {
        //     console.log("loi ne he", err)
        //     res.send({
        //         success: false,
        //         message: err
        //     });
        //     return;
        // }
      } else {
        console.log("No device");
        res.send({
          success: false,
          message: "device does not exits",
        });
        return;
      }
    });
  } catch (err) {
    console.log("loi ne", err);
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.verifyOnwerShareDevice = async (req, res, next) => {
  const token = req.token;
  const { deviceID, email } = req.body;
  if (!token || !deviceID || !email) {
    res.status(401).json(getErrorMessage());
    return;
  }

  console.log("do verify owner");
  try {
    const { uid } = await firebase.auth().verifyIdToken(token);
    const docs = db.collection("devices").doc(deviceID);
    docs.get().then(async (doc) => {
      if (
        doc.exists &&
        doc.data().auth === uid &&
        doc.data().actived === true
      ) {
        // next();
        try {
          const userRecord = await firebase.auth().getUserByEmail(email);
          console.log(userRecord.uid);
          if (doc.data().refUser.includes(userRecord.uid)) {
            console.log("ton tai roi");
            res.json({ success: false, message: "Người dùng đã tồn tại" });
            return;
          }
          const deviceInfo = { name: doc.data().name, desc: doc.data().desc };
          req.body.deviceInfo = deviceInfo;
          req.body.uid = uid;
          req.body.auth = userRecord.uid;
          next();
        } catch (err) {
          console.log("loi ne he", err);
          res.status(401).json({
            success: false,
            message: err.message,
          });
          return;
        }
      } else {
        console.log("No device");
        res.status(401).json({
          success: false,
          message: "device does not exits",
        });
        return;
      }
    });
  } catch (err) {
    console.log("loi ne", err);
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.verifyOnwerUpdateShareDevice = async (req, res, next) => {
  const token = req.token;
  const { deviceID, email } = req.body;
  if (!token || !deviceID || !email) {
    res.status(401).json(getErrorMessage());
    return;
  }

  console.log("do verify owner");
  try {
    const { uid } = await firebase.auth().verifyIdToken(token);
    const docs = db.collection("devices").doc(deviceID);
    docs.get().then(async (doc) => {
      if (
        doc.exists &&
        doc.data().auth === uid &&
        doc.data().actived === true
      ) {
        // next();
        try {
          const userRecord = await firebase.auth().getUserByEmail(email);
          console.log(userRecord.uid);
          if (doc.data().refUser.includes(userRecord.uid)) {
            // let identity = ''
            // await db.collection('bcAccounts').where("auth",'==',userRecord.uid).where("deviceID","==",deviceID).get().then(
            //     doc=>{
            //         if(doc.size > 0){
            //             doc.forEach(elem=>{
            //                 console.log("co user")
            //                 identity = doc.data().bcIdentity;
            //                 console.log(doc.data())
            //             })
            //         }else{
            //             res.status(401).json({success : false ,message : 'Uuser Account does not exits'})
            //             return;
            //         }

            //     }
            // ).catch(err=>{res.status(401).json({success : false ,message : err.message}) ;return})
            // console.log(identity)
            req.body.auth = userRecord.uid;
            next();
          } else {
            res.status(401).json({
              success: false,
              message: "Nguoi dung chua duoc chia se",
            });
          }
        } catch (err) {
          console.log("loi ne he", err);
          res.status(401).json({
            success: false,
            message: err.message,
          });
          return;
        }
      } else {
        console.log("No device");
        res.status(401).json({
          success: false,
          message: "device does not exits",
        });
        return;
      }
    });
  } catch (err) {
    console.log("loi ne", err);
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.ownerBCUser = async (req, res, next) => {
  const token = req.token;
  const { bcIdentity, deviceID } = req.body;
  if (!token || !deviceID || !bcIdentity) {
    res.status(401).json(getErrorMessage());
    return;
  }
  console.log(bcIdentity);
  try {
    const { uid } = await firebase.auth().verifyIdToken(token);
    const docs = db
      .collection("bcAccounts")
      .where("auth", "==", uid)
      .where("bcIdentity", "==", bcIdentity)
      .where("deviceID", "==", deviceID);
    docs.get().then(async (doc) => {
      console.log(doc.size);
      if (doc.size > 0) {
        req.body.uid = uid;
        next();
      } else {
        res.status(401).json({
          success: false,
          message: `${bcIdentity} does not exist`,
        });
        return;
      }
    });
  } catch (err) {
    console.log("loi ne", err);
    res.status(401).json({
      success: false,
      message: err.message,
    });
    return;
  }
};

// module.exports.ownerBCUser = async (req, res, next) => {
//     const token = req.token
//     const { userAccount, deviceType, deviceID } = req.body
//     const colectionName = deviceType === 'own' ? 'ownDevice' : 'refDevices';
//     if (!token || !deviceID || !userAccount || !deviceType) {
//         res.json(getErrorMessage());
//         return;
//     }

//     try {
//         const { uid } = await firebase.auth().verifyIdToken(token);
//         const docs = db.collection(colectionName).where("auth", "==", uid).where('bcUser', "==", userAccount).where('deviceID', "==", deviceID);
//         docs.get().then(async (doc) => {
//             console.log(doc.size)
//             if (doc.size > 0) {
//                 req.body.uid = uid;
//                 next();
//             } else {
//                 res.send({
//                     success: false,
//                     message: `${userAccount} does not exist`
//                 });
//                 return;
//             }
//         })
//     } catch (err) {
//         console.log("loi ne", err)
//         res.send({
//             success: false,
//             message: err
//         });
//         return;
//     }
// }
