"use strict";

const express = require("express");
const controller = require("../controllers/device.controller");
const middleware = require("../midleware/device.midleware");
// const { route } = require("./auth.route");

const router = express.Router();

router.post(
  "/datadevice",
  [middleware.devicemidlewaregetdata],
  controller.getDataDevice
);
router.post(
  "/datastatisticaldevice",
  [middleware.devicemidlewaregetdata],
  controller.getDataStatisticalDevice
);

router.post(
  "/downloadstatisticaldevice",
  [middleware.devicemidlewaregetdata],
  controller.downloadDataStatisticalDevice
);
router.post(
  "/sensorsinfo",
  [middleware.devicemidlewaregetdata],
  controller.getDeviceField
);

router.post(
  "/pushdata",
  [middleware.devicemidlewarepost],
  controller.pushDataDevice
);

router.post(
  "/pushdatatestwaspmost",
  [middleware.devicemidlewarepost],
  controller.pushDataDeviceTestWaspmost
);

module.exports = router;
