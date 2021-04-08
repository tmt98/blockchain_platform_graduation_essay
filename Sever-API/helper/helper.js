"use strict";

const { Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
const util = require("util");
const FabricCAServices = require("fabric-ca-client");

// GET CCP:
const getCCP = async (org) => {
  let ccpPath;
  if (org == process.env.ORGWRITER) {
    ccpPath = path.resolve(
      __dirname,
      "..",
      "config",
      process.env.CONNECTFILEWRITER
    );
  } else if (org == process.env.ORGREADER) {
    ccpPath = path.resolve(
      __dirname,
      "..",
      "config",
      process.env.CONNECTFILEREADER
    );
  } else return null;
  const ccpJSON = fs.readFileSync(ccpPath, "utf8");
  const ccp = JSON.parse(ccpJSON);
  return ccp;
};

// GET CA URL:
const getCaPem = async (org, ccp) => {
  let capem;
  if (org == process.env.ORGWRITER) {
    capem = ccp.certificateAuthorities[process.env.CAWRITER].tlsCACerts.pem;
  } else if (org == process.env.ORGREADER) {
    capem = ccp.certificateAuthorities[process.env.CAREADER].tlsCACerts.pem;
  } else return null;
  return capem;
};

const getCaUrl = async (org, ccp) => {
  let caURL;
  if (org == process.env.ORGWRITER) {
    caURL = ccp.certificateAuthorities[process.env.CAWRITER].url;
  } else if (org == process.env.ORGREADER) {
    caURL = ccp.certificateAuthorities[process.env.CAREADER].url;
  } else return null;
  return caURL;
};

// GET WALLET:
const getWalletPath = async (org) => {
  let walletPath;
  if (org == process.env.ORGWRITER) {
    walletPath = path.join(process.cwd(), "./.wallet/writer");
  } else if (org == process.env.ORGREADER) {
    walletPath = path.join(process.cwd(), "./.wallet/reader");
  } else return null;
  return walletPath;
};

// GET AFFILIANTION
const getAffiliantion = async (org) => {
  return org === process.env.ORGWRITER
    ? process.env.DEPARTMENTWRITER
    : process.env.DEPARTMENTREADER;
};

// GET REGISTER USER
const getRegisterUser = async (username, userOrg, deviceID) => {
  let ccp = await getCCP(userOrg);
  const caURL = await getCaUrl(userOrg, ccp);
  const ca = new FabricCAServices(caURL);

  const walletPath = await getWalletPath(userOrg);
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);

  const userIdentity = await wallet.get(username);
  if (userIdentity) {
    console.log(
      `An identity for the user ${username} already exists in the wallet`
    );
    var respone = {
      success: true,
      message: username + " endrolled Successfully",
    };
    return respone;
  }
  const adminId = process.env.ADMINUSERID;

  let adminIdentity = await wallet.get(adminId);
  if (!adminIdentity) {
    console.log(
      `An identity for the admin user '${adminId}' does not exist in the wallet`
    );
    await enrollAdmin(userOrg, ccp);
    adminIdentity = await wallet.get(adminId);
    console.log("Admin Enrolled Successfully");
  }

  // build a user object for authenticating with the CA
  const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
  const adminUser = await provider.getUserContext(adminIdentity, adminId);
  let secret;
  try {
    secret = await ca.register(
      {
        affiliation: await getAffiliantion(userOrg),
        enrollmentID: username,
        role: "client",
        attrs: [
          { name: "deviceID", value: deviceID, ecert: true },
          { name: "role", value: "owner", ecert: true },
        ],
      },
      adminUser
    );
  } catch (error) {
    return error.message;
  }

  const enrollment = await ca.enroll({
    enrollmentID: username,
    enrollmentSecret: secret,
    attr_reqs: [
      { name: "deviceID", optional: false },
      { name: "role", optional: false },
    ],
  });
  console.log(enrollment.certificate);
  let x509Identity = {
    credentials: {
      certificate: enrollment.certificate,
      privateKey: enrollment.key.toBytes(),
    },
    mspId:
      userOrg === process.env.ORGWRITER
        ? process.env.ORGWRITERMSP
        : process.env.ORGREADERMSP,
    type: "X.509",
  };

  await wallet.put(username, x509Identity);
  console.log(
    `Successfully registered and enrolled admin user ${username} and imported it into the wallet`
  );
  var respone = {
    success: true,
    message: username + " enrolled Successfully",
  };
  return respone;
};

const getRegisterUser1 = async (
  username,
  userOrg,
  deviceID,
  deviceInfo,
  sharefield
) => {
  let ccp = await getCCP(userOrg);
  const caURL = await getCaUrl(userOrg, ccp);
  const ca = new FabricCAServices(caURL);

  const walletPath = await getWalletPath(userOrg);
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);

  const userIdentity = await wallet.get(username);
  if (userIdentity) {
    console.log(
      `An identity for the user ${username} already exists in the wallet`
    );
    var respone = {
      success: true,
      message: username + " endrolled Successfully",
    };
    return respone;
  }
  const adminId = process.env.ADMINUSERID;

  let adminIdentity = await wallet.get(adminId);
  if (!adminIdentity) {
    console.log(
      `An identity for the admin user '${adminId}' does not exist in the wallet`
    );
    await enrollAdmin(userOrg, ccp);
    adminIdentity = await wallet.get(adminId);
    console.log("Admin Enrolled Successfully");
  }

  // build a user object for authenticating with the CA
  const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
  const adminUser = await provider.getUserContext(adminIdentity, adminId);
  let secret;
  try {
    secret = await ca.register(
      {
        affiliation: await getAffiliantion(userOrg),
        enrollmentID: username,
        role: "client",
        attrs: [
          { name: "deviceID", value: deviceID, ecert: true },
          {
            name: "deviceInfo",
            value: JSON.stringify(deviceInfo),
            ecert: true,
          },
          {
            name: "role",
            value: "refuser",
            ecert: true,
          },
          {
            name: "refField",
            value: JSON.stringify(sharefield),
            ecert: true,
          },
        ],
      },
      adminUser
    );
  } catch (error) {
    return error.message;
  }

  const enrollment = await ca.enroll({
    enrollmentID: username,
    enrollmentSecret: secret,
    attr_reqs: [
      { name: "deviceID", optional: false },
      { name: "role", optional: false },
      { name: "refField", optional: false },
      { name: "deviceInfo", optional: false },
    ],
  });
  console.log(enrollment.certificate);
  let x509Identity = {
    credentials: {
      certificate: enrollment.certificate,
      privateKey: enrollment.key.toBytes(),
    },
    mspId:
      userOrg === process.env.ORGWRITER
        ? process.env.ORGWRITERMSP
        : process.env.ORGREADERMSP,
    type: "X.509",
  };

  await wallet.put(username, x509Identity);
  console.log(
    `Successfully registered and enrolled admin user ${username} and imported it into the wallet`
  );
  var respone = {
    success: true,
    message: username + " enrolled Successfully",
  };
  return respone;
};

const updateShareField = async (userId, attrValue) => {
  let ccp = await getCCP(process.env.ORGREADER);
  const caInfo = await getCaInfo(process.env.ORGREADER, ccp);
  const caURL = caInfo.url;
  const caTLSCACerts = caInfo.tlsCACerts.pem;
  const caClient = new FabricCAServices(
    caURL,
    { trustedRoots: caTLSCACerts, verify: false },
    caInfo.caName
  );
  const walletPath = await getWalletPath(process.env.ORGREADER);
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  // console.log(`Wallet path: ${walletPath}`);

  try {
    const userIdentity = await wallet.get(userId);
    if (!userIdentity) {
      console.log(`${userId} does not exists in the wallet`);
      return;
    }

    const adminIdentity = await wallet.get(process.env.ADMINUSERID);
    if (!adminIdentity) {
      console.log(
        "An identity for the admin user does not exist in the wallet"
      );
      console.log("Enroll the admin user before retrying");
      await enrollAdmin(process.env.ORGREADER, ccp);
      adminIdentity = await wallet.get(process.env.ADMINUSERID);
      console.log("Admin Enrolled Successfully");
    }

    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);
    const adminProvider = await provider.getUserContext(
      adminIdentity,
      process.env.ADMINUSERID
    );
    const identityService = caClient.newIdentityService();
    const user = await identityService.getOne(userId, adminProvider);
    console.log(user.result.attrs);

    const customattrs = {
      attrs: [
        {
          name: "refField",
          value: JSON.stringify(attrValue),
          ecert: true,
        },
      ],
    };

    const response = await identityService.update(
      userId,
      customattrs,
      adminProvider
    );
    console.log("userIdenity attributes: ", response.result.attrs);
    const Userprovider = wallet
      .getProviderRegistry()
      .getProvider(userIdentity.type);
    const UserProvider = await Userprovider.getUserContext(
      userIdentity,
      userId
    );
    const enrollment = await caClient.reenroll(UserProvider);
    // console.log(enrollment);
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: process.env.ORGREADERMSP,
      type: "X.509",
    };
    await wallet.put(userId, x509Identity);
    const respone = {
      success: true,
      message: "Update attrs successfully",
    };
    return respone;
  } catch (error) {
    console.error(`Failed to update attrs ${error}`);
    return error.message;
  }
};

const revokeUser = async (userId, ORGNAME) => {
  let ccp = await getCCP(ORGNAME);
  const caInfo = await getCaInfo(ORGNAME, ccp);
  const caURL = caInfo.url;
  const caTLSCACerts = caInfo.tlsCACerts.pem;
  const caClient = new FabricCAServices(
    caURL,
    { trustedRoots: caTLSCACerts, verify: false },
    caInfo.caName
  );
  const walletPath = await getWalletPath(ORGNAME);
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  // console.log(`Wallet path: ${walletPath}`);

  try {
    const userIdentity = await wallet.get(userId);
    if (!userIdentity) {
      console.log(`${userId} does not exists in the wallet`);
      return;
    }

    const adminIdentity = await wallet.get(process.env.ADMINUSERID);
    if (!adminIdentity) {
      console.log(
        "An identity for the admin user does not exist in the wallet"
      );
      console.log("Enroll the admin user before retrying");
      await enrollAdmin(ORGNAME, ccp);
      adminIdentity = await wallet.get(process.env.ADMINUSERID);
      console.log("Admin Enrolled Successfully");
    }

    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);
    const adminProvider = await provider.getUserContext(
      adminIdentity,
      process.env.ADMINUSERID
    );

    const result = await caClient.revoke(
      { enrollmentID: userId },
      adminProvider
    );

    if (result.success === true) {
      wallet.remove(userId);
      const respone = {
        success: true,
        message: "Revoke successfully",
      };
      return respone;
    } else {
      const respone = {
        success: false,
        message: "Revoke failed",
      };
      return respone;
    }
  } catch (error) {
    console.error(`Failed to revoke ${error}`);
    return error.message;
  }
};

const getAttrsUSer = async (userId) => {
  let ccp = await getCCP(process.env.ORGREADER);
  const caInfo = await getCaInfo(process.env.ORGREADER, ccp);
  const caURL = caInfo.url;
  const caTLSCACerts = caInfo.tlsCACerts.pem;
  const caClient = new FabricCAServices(
    caURL,
    { trustedRoots: caTLSCACerts, verify: false },
    caInfo.caName
  );
  const walletPath = await getWalletPath(process.env.ORGREADER);
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  try {
    const userIdentity = await wallet.get(userId);
    if (!userIdentity) {
      console.log(`${userId} does not exists in the wallet`);
      return;
    }

    const adminIdentity = await wallet.get(process.env.ADMINUSERID);
    if (!adminIdentity) {
      console.log(
        "An identity for the admin user does not exist in the wallet"
      );
      console.log("Enroll the admin user before retrying");
      await enrollAdmin(process.env.ORGREADER, ccp);
      adminIdentity = await wallet.get(process.env.ADMINUSERID);
      console.log("Admin Enrolled Successfully");
    }

    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);
    const adminProvider = await provider.getUserContext(
      adminIdentity,
      process.env.ADMINUSERID
    );
    const identityService = caClient.newIdentityService();
    console.log("Aaaa");
    const user = await identityService.getOne(userId, adminProvider);
    return user.result.attrs;
    // console.log(user.result.attrs)
    // const attrs = user.result.attrs.find((item) => item.name == "refField");
    // console.log(JSON.parse(attrs.value));
    // return JSON.parse(attrs.value);
  } catch (error) {
    console.log(error);
  }
};

const isUserRegistered = async (username, userOrg) => {
  const walletPath = await getWalletPath(userOrg);
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  // console.log(`Wallet path: ${walletPath}`);

  const userIdentity = await wallet.get(username);
  if (userIdentity) {
    console.log(`An identity for the user ${username} exists in the wallet`);
    return true;
  }
  return false;
};

const getCaInfo = async (org, ccp) => {
  let caInfo;
  if (org == process.env.ORGWRITER) {
    caInfo = ccp.certificateAuthorities[process.env.CAWRITER];
  } else if (org == process.env.ORGREADER) {
    caInfo = ccp.certificateAuthorities[process.env.CAREADER];
  } else return null;
  return caInfo;
};

const enrollAdmin = async (org, ccp) => {
  console.log("calling enroll Admin method");

  try {
    const caInfo = await getCaInfo(org, ccp);
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(
      caInfo.url,
      { trustedRoots: caTLSCACerts, verify: false },
      caInfo.caName
    );
    const walletPath = await getWalletPath(org);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // ???
    const adminId = process.env.ADMINUSERID;
    const identity = await wallet.get(adminId);
    if (identity) {
      console.log(
        `An identity for the admin user '${adminId}' doesb exist in the wallet`
      );
      return;
    }

    const enrollment = await ca.enroll({
      enrollmentID: adminId,
      enrollmentSecret: process.env.ADMINPASS,
    });
    // console.log(enrollment);
    let x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId:
        org === process.env.ORGWRITER
          ? process.env.ORGWRITERMSP
          : process.env.ORGREADERMSP,
      type: "X.509",
    };

    await wallet.put(adminId, x509Identity);
    console.log(
      `Successfully enrolled admin user ${adminId} and imported it into the wallet`
    );
  } catch (error) {
    console.error(
      `Failed to enroll admin user "${process.env.ADMINUSERID}": ${error}`
    );
  }
};

exports.getRegisterUser = getRegisterUser;

module.exports = {
  getCCP: getCCP,
  getWalletPath: getWalletPath,
  getAttrsUSer: getAttrsUSer,
  updateShareField: updateShareField,
  getRegisterUser: getRegisterUser,
  getRegisterUser1: getRegisterUser1,
  revokeUser: revokeUser,
  isUserRegistered: isUserRegistered,
};
