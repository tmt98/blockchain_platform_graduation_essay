"use strict";

const express = require("express");
const controller = require("../controllers/admin.controller");
const router = express.Router();
const middleware = require("../midleware/admin.midleware");
// ROUTER GET
router.post("/setcustomclaims", controller.setcustomClaims);
router.post("/activedevice", [middleware.checkadmin], controller.activedevice);
router.post(
  "/refreshdevicetoken",
  [middleware.checkadmin, middleware.refreshTokenMidleware],
  controller.refreshToken
);
module.exports = router;
