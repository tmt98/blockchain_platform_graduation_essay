"use strict";

const express = require("express");
const controller = require("../controllers/user.controller");
const router = express.Router();
const middleware = require("../midleware/user.middleware");
// ROUTER GET
router.post("/adddevice", [middleware.verifytoken], controller.adddevice);
router.post(
  "/updatephonenumber",
  [middleware.verifytoken],
  controller.updatePhoneNumber
);
router.post(
  "/sharedevice",
  [middleware.verifyOnwerShareDevice],
  controller.registerEnrollNewUser
);
router.post(
  "/updatefieldshare",
  [middleware.verifyOnwerUpdateShareDevice],
  controller.updateSharefield
);
router.post("/getrefuserinfo", [middleware.verifyOnwer], controller.getRefUser);
router.post("/getuserfield", [middleware.verifyOnwer], controller.getField);
router.post("/gettoken", [middleware.ownerBCUser], controller.getToken);
router.post("/revokeuser", [middleware.verifyOnwer], controller.rovokeUser);

module.exports = router;
