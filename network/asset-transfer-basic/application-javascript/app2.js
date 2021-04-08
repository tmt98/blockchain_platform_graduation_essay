/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Gateway, Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const {
  buildCAClient,
  registerAndEnrollUser,
  enrollAdmin,
  updateattrsUserForshareField,
  revokeUser,
} = require("../../test-application/javascript/CAUtil.js");
const {
  buildCCPOrg2,
  buildWallet,
} = require("../../test-application/javascript/AppUtil.js");

const channelName = "channel1";
// const channelName = 'channel';
// const role = "reader";
const role = "writer";
const chaincodeName = "basic";
const mspOrg = "Org2MSP";
const walletPath = path.join(__dirname, "wallet2");
// const org1UserId = 'appUser';
// const org1UserId = `user10`;
const orgUserId = `6e49e360847b230682088db62fe628a61432128b`;
const deviceID = "fXoWrtLf5czrFSNq6GKS";

function prettyJSONString(inputString) {
  return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function main() {
  try {
    // build an in memory object with the network configuration (also known as a connection profile)
    const ccp = buildCCPOrg2();

    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caClient = buildCAClient(
      FabricCAServices,
      ccp,
      "ca.org2.example.com"
    );

    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(Wallets, walletPath);

    // in a real application this would be done on an administrative flow, and only once
    await enrollAdmin(caClient, wallet, mspOrg);
    // const attr = [
    //   {
    //     field_display: "Nhiệt độ",
    //     field_name: "temperature",
    //     field_unit: "oC",
    //     share: true,
    //   },
    //   {
    //     field_display: "pH",
    //     field_name: "ph",
    //     field_unit: "pH",
    //     share: true,
    //   },
    //   {
    //     field_display: "Độ ẩm",
    //     field_name: "humidity",
    //     field_unit: "%",
    //     share: true,
    //   },
    // ];
    // in a real application this would be done only when a new user was required to be added
    // and would be part of an administrative flow
    // await registerAndEnrollUser(caClient, wallet, mspOrg, orgUserId, 'org2.department1', deviceID,attr);

    // Create a new gateway instance for interacting with the fabric network.
    // In a real application this would be done as the backend server session is setup for
    // a user that has been verified.
    const gateway = new Gateway();

    try {
      await revokeUser(caClient, wallet, orgUserId);
      //   await updateattrsUserForshareField(
      //     caClient,
      //     wallet,
      //     mspOrg,
      //     orgUserId,
      //     "refField",
      //     attr
      //   );
      // setup the gateway instance
      // The user will now be able to create connections to the fabric network and be able to
      // submit transactions and query. All transactions submitted by this gateway will be
      // signed by this user using the credentials stored in the wallet.
      // await gateway.connect(ccp, {
      //   wallet,
      //   identity: orgUserId,
      //   // identity: 'admin',//

      //   discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
      // });

      // console.log(gateway.getIdentity())

      // const admin = gateway.getIdentity();
      // const provider = wallet.getProviderRegistry().getProvider(admin.type);
      // const adminUser = await provider.getUserContext(admin, orgUserId);
      // // const adminUser = await provider.getUserContext(admin, 'admin');

      // const enrollment = await caClient.reenroll(adminUser)
      // console.log(enrollment)
      // const x509Identity = {
      // 	credentials: {
      // 		certificate: enrollment.certificate,
      // 		privateKey: enrollment.key.toBytes(),
      // 	},
      // 	mspId: mspOrg,
      // 	type: 'X.509',
      // };
      // await wallet.put(orgUserId, x509Identity);
      // console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
      // const identityService = caClient.newIdentityService()
      // console.log(identityService)
      // const user =  await identityService.getOne(orgUserId,adminUser)
      // console.log(user.result.attrs)
      // console.log(ca)

      // const customattrs = {
      // 	// type:"client",
      // 	// affiliation:"org1.department1" ,
      // 	attrs: [
      // 		// { name: "deviceID", value: deviceID, ecert: true }

      // 		,{
      // 		name : 'field',value: JSON.stringify([
      // 		// {
      // 		// 	field_display: "Nhiệt độ",
      // 		// 	field_name : 'temperature',
      // 		// 	field_unit : "oC"
      // 		// },
      // 		{
      // 			field_display: "pH",
      // 			field_name : 'ph',
      // 			field_unit : "pH"
      // 		}])
      // 		,ecert : true
      // 	}] ,

      // 	// caname : caClient.getCaName()
      // }

      // const response = await identityService.update(orgUserId,customattrs,adminUser)
      // console.log("userIdenity attributes: ",response.result.attrs)

      // Build a network instance based on the channel where the smart contract is deployed
      // const network = await gateway.getNetwork(channelName);

      // // // Get the contract from the network.
      // const contract = network.getContract(chaincodeName);
      // let data = {
      // 	ph: 11,
      // 	temperature: 20,
      // 	timestamp: Math.ceil(new Date().getTime() / 1000)
      // }
      // // console.log('\n--> Submit Transaction: CreateAsset, creates new asset with ID, color, owner, size, and appraisedValue arguments');
      // // let rst = await contract.submitTransaction('pushStateDevice', deviceID, JSON.stringify(data));

      // // console.log(`*** Result: ${prettyJSONString(rst.toString())}`);
      // // if (rst == false) console.log("err"); else console.log("commited");

      // console.log(
      //   "\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger"
      // );
      // let result = await contract.evaluateTransaction(
      //   "getStatiscalDevice",
      //   deviceID,
      //   1608358501,
      //   1608449400
      // );
      // console.log(JSON.parse(result).length);
      // console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`******** FAILED to run the application: ${error}`);
  }
}

main();
