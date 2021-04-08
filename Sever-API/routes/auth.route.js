"use strict";

const express = require("express");
const controller = require("../controllers/auth.controller");
const router = express.Router();
// ROUTER GET
// router.post("/register", controller.registerEnrollNewUser);
router.post("/gettoken", controller.getToken);

// ROUTER POST

module.exports = router;