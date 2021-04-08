/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices  = require('fabric-ca-client');
const FabricCAClient = require('fabric-ca-client')
// console.log(Fac)
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildCCPOrg2, buildWallet } = require('../../test-application/javascript/AppUtil.js');


const channelName = 'channel1';
// const channelName = 'channel';
const role = "reader";
// const role = "writer";
const chaincodeName = 'basic';
const mspOrg = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet1');
// const org1UserId = 'appUser';
// const org1UserId = `user10`;
// const orgUserId = `${channelName}user${role}${mspOrg}`;
const orgUserId = 'user3';
const deviceID = "deviceid3"
function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

// pre-requisites:
// - fabric-sample two organization test-network setup with two peers, ordering service,
//   and 2 certificate authorities
//         ===> from directory /fabric-samples/test-network
//         ./network.sh up createChannel -ca
// - Use any of the asset-transfer-basic chaincodes deployed on the channel "mychannel"
//   with the chaincode name of "basic". The following deploy command will package,
//   install, approve, and commit the javascript chaincode, all the actions it takes
//   to deploy a chaincode to a channel.
//         ===> from directory /fabric-samples/test-network
//         ./network.sh deployCC -ccn basic -ccl javascript
// - Be sure that node.js is installed
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         node -v
// - npm installed code dependencies
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         npm install
// - to run this test application
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         node app.js

// NOTE: If you see  kind an error like these:
/*
	2020-08-07T20:23:17.590Z - error: [DiscoveryService]: send[mychannel] - Channel:mychannel received discovery error:access denied
	******** FAILED to run the application: Error: DiscoveryService: mychannel error: access denied

   OR

   Failed to register user : Error: fabric-ca request register failed with errors [[ { code: 20, message: 'Authentication failure' } ]]
   ******** FAILED to run the application: Error: Identity not found in wallet: appUser
*/
// Delete the /fabric-samples/asset-transfer-basic/application-javascript/wallet directory
// and retry this application.
//
// The certificate authority must have been restarted and the saved certificates for the
// admin and application user are not valid. Deleting the wallet store will force these to be reset
// with the new certificate authority.
//

/**
 *  A test application to show basic queries operations with any of the asset-transfer-basic chaincodes
 *   -- How to submit a transaction
 *   -- How to query and check the results
 *
 * To see the SDK workings, try setting the logging to show on the console before running
 *        export HFC_LOGGING='{"debug":"console"}'
 */
async function main() {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg);
		// const identityService = caClient.newIdentityService()
		// console.log(identityService)
		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		 await registerAndEnrollUser(caClient, wallet, mspOrg, orgUserId, 'org1.department1', deviceID);

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		// const identityService = caClient.newIdentityService()
		// console.log(identityService)


		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				// identity: 'admin',
				identity: orgUserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});


			// const admin = gateway.getIdentity();
			// const provider = wallet.getProviderRegistry().getProvider(admin.type);
			// const adminUser = await provider.getUserContext(admin, 'admin');
			// const identityService = caClient.newIdentityService()
			// // // console.log(identityService)
			// const user =  await identityService.getOne("user2",adminUser)
			// console.log(user.result.attrs)
			// // console.log(ca)

			// const customattrs = {
			// 	// type:"client",
			// 	// affiliation:"org1.department1" ,	
			// 	attrs: [{ name: "deviceID", value: "deviceid4", ecert: true },{
			// 		name : 'field',value: JSON.stringify([{
			// 			field_display: "Nhiệt độ",
			// 			filed_name : 'temperature',
			// 			field_unit : "oC"
			// 		},
			// 		{
			// 			field_display: "pH",
			// 			filed_name : 'ph',
			// 			field_unit : "pH"
			// 		},
			// 		{
			// 			field_display: "Độ ẩm",
			// 			filed_name : 'humidity',
			// 			field_unit : "%"
			// 		}])
			// 		,ecert : true
			// 	}] ,
				
			// 	// caname : caClient.getCaName()
			// }

			// const response = await identityService.update("user2",customattrs,adminUser)
			// console.log("userIdenity attributes: ",response.result.attrs)
			// // const ca = gateway.getClient().getCertificateAuthority();
			// // const adminIdentity = gateway.getIdentity();

			// // const identityService = caClient.newIdentityService();
			// // const retrieveIdentity = await identityService.getOne(org1UserId, adminIdentity)
			// // console.log("user attributes: ", retrieveIdentity.result.attrs)
			// // // Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// // Get the contract from the network.
			const contract = network.getContract(chaincodeName);


			let data = {
				ph: 7,
				temperature: 12,
				humidity : 55,
				timestamp: Math.ceil(new Date().getTime() / 1000)
			}

			console.log('\n--> Submit Transaction: CreateAsset, creates new asset with ID, color, owner, size, and appraisedValue arguments');
			let rst = await contract.submitTransaction('pushStateDevice', deviceID, JSON.stringify(data));

			console.log(`*** Result: ${prettyJSONString(rst.toString())}`);
			if (rst == false) console.log("err"); else console.log("commited");

			// console.log('\n--> Submit Transaction: CreateAsset, creates new asset with ID, color, owner, size, and appraisedValue arguments');
			// let rst = await contract.submitTransaction('updateDevice', sensorid, JSON.stringify(data));
			// // console.log()
			// console.log(`*** Result: ${prettyJSONString(rst.toString())}`);
			// if (rst == false) console.log("err"); else console.log("commited");


			// console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
			// let result = await contract.evaluateTransaction('getHistoryDevice', deviceID);
			// console.log(JSON.parse(result))
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);


		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			// gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

main();
