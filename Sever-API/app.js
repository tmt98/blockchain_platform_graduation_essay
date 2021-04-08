import express from "express";
import bodyParser from "body-parser";
import { db, firebase } from "./fbadim/fb-hook";
import dotenv from "dotenv";
import { DeepstreamClient } from "@deepstream/client";
import { getLogger } from "log4js";
const logger = getLogger("APP.JS");
import util from "util";
import http from "http";
// import path from 'path'
import cors from "cors";
import morgan from "morgan";
import expressJWT from "express-jwt";
import jwt from "jsonwebtoken";
import bearerToken from "express-bearer-token";
import constants from "./config/constans.json";
import authRouter from "./routes/auth.route";
import deviceRoute from "./routes/device.route";
import userRoute from "./routes/user.route";
import adminRoute from "./routes/admin.route";
// import device from './helper/device.app'
dotenv.config();
const app = express();
const host = process.env.HOST || constants.host;
const port = process.env.PORT || constants.port;
export const client = new DeepstreamClient("localhost:6020");
client.login();
export const record = client.record.getRecord("news");
import { sendmail } from "./mailer/mailer";

app.set("secret", process.env.SECRECTJWT);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
app.options("*", cors());
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  expressJWT({
    secret: process.env.SECRECTJWT,
    algorithms: ["HS256"],
  }).unless({
    path: [
      "/api/admin",
      "/api/admin/setcustomclaims",
      "/api/admin/activedevice",
      "/api/admin/refreshdevicetoken",
      "/api/user",
      "/api/user/sharedevice",
      "/api/user/adddevice",
      "/api/user/gettoken",
      "/api/user/updatephonenumber",
      "/api/user/getrefuserinfo",
      "/api/user/updatefieldshare",
      "/api/user/getuserfield",
      "/api/user/revokeuser",
      "/api/device/pushdata",
      "/api/device/pushdatatestwaspmost",
    ],
  })
);
app.use(bearerToken());
logger.level = "debug";
// app.use((req, res, next) => {
//     logger.debug('New req for %s', req.originalUrl);
//     if (req.originalUrl.indexOf('/api/auth') >= 0
//         // || req.originalUrl.indexOf('/api/device') >= 0
//         || req.originalUrl.indexOf('/api/auth/register') >= 0
//         || req.originalUrl.indexOf('/api/auth/gettoken') >= 0
//         || req.originalUrl.indexOf('/api/device/pushdata') >= 0
//         || req.originalUrl.indexOf('/api/auth/verify') >= 0) {
//         // console.log("pass")
//         // console.log("token", req.token)
//         // console.log("headers", req.headers.authorization.split(' ')[1]);
//         return next();
//     }
//     console.log("do day")
//     var token = req.token;
//     // console.log("token", req.token)
//     // console.log("headers", req.headers.authorization);
//     jwt.verify(token, app.get('secret'), (err, decoded) => {
//         if (err) {
//             console.log(`Error ================:${err}`)
//             res.send({
//                 success: false,
//                 message: 'Failed to authenticate token. Make sure to include the ' +
//                     'token returned from /api/auth call in the authorization header ' +
//                     ' as a Bearer token'
//             });
//             return;
//         } else {
//             req.decode = decoded;
//             // req.orgname = decoded.orgName;
//             logger.debug(util.format('Decoded from JWT token: username - %s, orgname - %s', decoded.username, decoded.orgName));
//             return next();
//         }
//     });
// });

// app.post("/api/auth/verify", async (req, res) => {
//     const token = req.body.token
//     const { deviceID, userAccount } = req.body
//     // console.log(token)
//     try {
//         const { uid, name } = await firebase.auth().verifyIdToken(token);
//         // console.log(userRecord)
//         // res.send("oke")
//         // const docs = db.collection("ownDevice").where("auth", "==", uid).where('deviceID', "==", deviceID);
//         // docs.get().then(async (doc) => {
//         //     console.log(doc.size)
//         //     if (doc.size > 0) {
//         //         console.log(userAccount)
//         //         try {
//         //             const userRecord = await firebase.auth().getUserByEmail(userAccount)
//         //             console.log(userRecord.uid)
//         //             res.send(userRecord.uid);
//         //         } catch (err) {
//         //             console.log("loi ne he", err)
//         //             res.send({
//         //                 success: false,
//         //                 message: err
//         //             });
//         //             return;
//         //         }

//         //     } else {
//         //         console.log("No device");
//         //         res.send({
//         //             success: false,
//         //             message: 'device does not exits'
//         //         });
//         //         return;
//         //     }
//         // })

//     } catch (err) {
//         console.log("loi ne", err)
//         res.send({
//             success: false,
//             message: err
//         });
//         return;
//     }
//     // firebase.auth().verifyIdToken(token).then(decode => {
//     //     console.log("day la uid", decode.uid)
//     //     res.send("oke")
//     // }).catch(err => {
//     //     console.log(err)
//     //     res.send("not oke")
//     // })
// })
// app.use("/api/auth", verifyOnwer, authRouter);
app.use("/api/device", deviceRoute);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

const server = http.createServer(app).listen(port, () => {
  console.log(`SERVER STARTED ON LOCALHOST:${port}`);
});
logger.info("********** SERVER START **************************");
logger.info("********** http://%s:%s *****************", host, port);
