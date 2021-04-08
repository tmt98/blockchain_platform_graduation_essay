const jwt = require("jsonwebtoken");
const log4js = require("log4js");
const { decode } = require("querystring");
const logger = log4js.getLogger("APP.JS");
const util = require("util");
const helper = require("../helper/helper");
const dotenv = require("dotenv");
dotenv.config();
const getErrorMessage = () => {
  let respone = {
    success: false,
    message: "Some field is missing or Invalid in the request",
  };
  return respone;
};
module.exports.devicemidlewaregetdata = async (req, res, next) => {
  logger.debug("New req for %s", req.originalUrl);
  const token = req.token;
  if (!token) {
    res.status(403).json(getErrorMessage());
    return;
  }

  try {
    const decoded = await jwt.verify(token, process.env.SECRECTJWT);
    req.decoded = decoded;
    next();
  } catch (error) {
    console.log(error.message);
    res.send({
      success: false,
      message:
        "Failed to authenticate token. Make sure to include the " +
        "token returned from /api/auth call in the authorization header " +
        " as a Bearer token",
    });
    return;
  }
};

module.exports.devicemidlewarepost = async (req, res, next) => {
  logger.debug("New req for %s", req.originalUrl);
  const token = req.body.token;
  if (!token) {
    res.status(403).json(getErrorMessage());
    return;
  }
  try {
    delete req.body.token;
    const decoded = await jwt.verify(token, process.env.SECRECTJWT);
    const isregistered = await helper.isUserRegistered(
      decoded,
      process.env.ORGWRITER
    );
    if (isregistered) {
      req.identity = decoded;
      next();
    } else {
      res.status(401).json({
        success: false,
        message: "Failed to authenticate token.",
      });
      return;
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      success: false,
      message:
        "Failed to authenticate token. Make sure to include the " +
        "token returned from /api/auth call in the authorization header " +
        " as a Bearer token",
    });
    return;
  }
};
