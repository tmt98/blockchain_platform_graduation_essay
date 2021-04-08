const { Gateway, Wallets } = require("fabric-network");
const { DeepstreamClient } = require("@deepstream/client");
const fs = require("fs");
const path = require("path");
const log4js = require("log4js");
const util = require("util");
const logger = log4js.getLogger("APP.JS");
const helper = require("../helper/helper");
const constants = require("../config/constans.json");
const dotenv = require("dotenv");
const { error } = require("console");
dotenv.config();

// const client = new DeepstreamClient("localhost:6020");
// client.login();
// const record = client.record.getRecord("news");

const getErrorMessage = (field) => {
  let respone = {
    success: false,
    message: field + " field is missing or Invalid in the request",
  };
  return respone;
};
module.exports.getDataDevice = async (username, deviceID) => {
  try {
    const ccp = await helper.getCCP(process.env.ORGREADER); //JSON.parse(ccpJSON);
    // Create a new file system based wallet for managing identities.
    const walletPath = await helper.getWalletPath(process.env.ORGREADER); //.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check to see if we've already enrolled the user.
    let identity = await wallet.get(username);
    if (!identity) {
      console.log(
        `An identity for the user ${username} does not exist in the wallet, so registering user`
      );
      // await helper.getRegisteredUser(username, org_name, true)
      // identity = await wallet.get(username);
      console.log("Run the registerUser.js application before retrying");
      return;
    }
    // console.log(identity.credentials.certificate);
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet: wallet,
      identity: username,
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork(process.env.CHANNELID);

    const contract = network.getContract(process.env.CHAINCODENAME);
    let result;

    result = await contract.evaluateTransaction(
      process.env.GETDATAFUNC,
      deviceID
    );

    result = JSON.parse(result);
    console.log(result);
    // for (let item in result) {
    //   result[item].data = JSON.parse(result[item].data);
    // }
    // console.log(result);
    return result;
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    return error.message;
  }
};

module.exports.getDataStatisticalDevice = async (
  username,
  deviceID,
  startDate,
  endDate
) => {
  try {
    const ccp = await helper.getCCP(process.env.ORGREADER); //JSON.parse(ccpJSON);
    // Create a new file system based wallet for managing identities.
    const walletPath = await helper.getWalletPath(process.env.ORGREADER); //.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check to see if we've already enrolled the user.
    let identity = await wallet.get(username);
    if (!identity) {
      console.log(
        `An identity for the user ${username} does not exist in the wallet, so registering user`
      );
      // await helper.getRegisteredUser(username, org_name, true)
      // identity = await wallet.get(username);
      console.log("Run the registerUser.js application before retrying");
      return;
    }
    // console.log(identity.credentials.certificate);
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet: wallet,
      identity: username,
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork(process.env.CHANNELID);

    const contract = network.getContract(process.env.CHAINCODENAME);
    let result;

    result = await contract.evaluateTransaction(
      process.env.GETSTATISTICAL,
      deviceID,
      startDate,
      endDate
    );

    result = JSON.parse(result);
    console.log(result);
    // for (let item in result) {
    //   result[item].data = JSON.parse(result[item].data);
    // }
    // console.log(result);
    return result;
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    return error.message;
  }
};

module.exports.pushDataDevice = async (username, deviceID, data) => {
  try {
    const ccp = await helper.getCCP(process.env.ORGWRITER); //JSON.parse(ccpJSON);
    const walletPath = await helper.getWalletPath(process.env.ORGWRITER); //.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check to see if we've already enrolled the user.
    let identity = await wallet.get(username);
    if (!identity) {
      console.log(
        `An identity for the user ${username} does not exist in the wallet, so registering user`
      );
      // await helper.getRegisteredUser(username, org_name, true)
      // identity = await wallet.get(username);
      console.log("Run the registerUser.js application before retrying");
      return new Error(
        `An identity for the user ${username} does not exist in the wallet`
      );
    }
    // console.log(identity.credentials.certificate);
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet: wallet,
      identity: username,
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork(process.env.CHANNELID);

    const contract = network.getContract(process.env.CHAINCODENAME);

    let result;

    result = await contract.submitTransaction(
      process.env.PUSHDATAFUNC,
      deviceID,
      JSON.stringify(data)
    );
    return result;
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    throw error;
  }
};

// exports.dataDevice = dataDevice;
