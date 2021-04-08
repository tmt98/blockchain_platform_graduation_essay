"use strict";

// const FabricCAServices = require("fabric-ca-client");
// const { Wallets } = require("fabric-network");
// const fs = require("fs");
// const yaml = require("js-yaml");
const jwt = require("jsonwebtoken");
const log4js = require("log4js");
const logger = log4js.getLogger("APP.JS");
const helper = require("../helper/helper");
const constants = require("../config/constans.json");
const dotenv = require("dotenv");
const { randomBytes } = require('crypto');
import { db } from '../fbadim/fb-hook'
dotenv.config();
const getErrorMessage = (field) => {
  let respone = {
    success: false,
    message: field + " field is missing or Invalid in the request",
  };
  return respone;
};

// module.exports.registerEnrollNewUser = async (req, res) => {
//   const { body } = req;
//   // const { username, orgName, channel, role } = body;
//   const { channel, deviceID, auth, owner, sensors } = body
//   console.log(body)
//   // res.send("okey")
//   // logger.debug(
//   //   "Username: " + username + " || Org: " + orgName + " || Channel: " + channel
//   // );
//   if (!auth) {
//     res.json(getErrorMessage("'username'"));
//     return;
//   }
//   if (!deviceID) {
//     res.json(getErrorMessage("'orgName'"));
//     return;
//   }
//   if (!channel) {
//     res.json(getErrorMessage("'channel'"));
//     return;
//   }
//   if (!owner) {
//     res.json(getErrorMessage("'channel'"));
//     return;
//   }
//   // console.log(process.env.SECRECTJWT)
//   // let token = jwt.sign({
//   //   exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
//   //   username: username,
//   //   orgName: orgName,
//   //   channel: channel
//   // }, process.env.SECRECTJWT);
//   const username = randomBytes(20).toString('hex');
//   try {
//     let response = await helper.getRegisterUser(username, 'Org1', channel, 'reader');
//     if (response && typeof response !== "string") {
//       logger.debug('Successfully registered the username %s for organization %s', username, 'Org1');
//       const doc = {
//         auth: auth,
//         owner: owner,
//         deviceID: deviceID,
//         channel: channel,
//         device: db.doc('devices/' + deviceID),
//         refSensors: sensors,
//         bcUser: username
//       }
//       await db.collection('refDevices').add(doc)

//       // response.token = token
//       res.json({ response });
//     } else {
//       res.json({ success: false, message: response });
//     }
//   } catch (err) {
//     console.error(err);
//     res.json({ success: false, message: response });
//   }


//   // if (response && typeof response !== "string") {
//   //   logger.debug('Successfully registered the username %s for organization %s', username, orgName);
//   //   response.token = token
//   //   res.json({ response });
//   // } else {
//   //   res.json({ success: false, message: response });
//   // }
// };

module.exports.getToken = async (req, res) => {
  const { body } = req;
  const { username, orgName, channel } = body;
  logger.debug(
    "Username: " + username + " || Org: " + orgName + " || Channel: " + channel
  );
  if (!username) {
    res.json(getErrorMessage("'username'"));
    return;
  }
  if (!orgName) {
    res.json(getErrorMessage("'orgName'"));
    return;
  }
  if (!channel) {
    res.json(getErrorMessage("'channel'"));
    return;
  }
  let token = jwt.sign(
    {
      // exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expresstime),

      username: username,
      orgName: orgName,
      channel: channel,
    },
    process.env.SECRECTJWT
  );
  let isUserRegistered = await helper.isUserRegistered(username, orgName);

  if (isUserRegistered) {
    res.json({
      success: true,
      message: { token: token },
    });
  } else {
    // res.json({
    //   success: false,
    //   message: `${username} is not registered with ${orgName} on channel ${channel}`,
    // });
    console.log("loi ne")
    res.error(401).json({
      message: "user does not exist"
    })
  }
};

