/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Contract } = require("fabric-contract-api");
const { error } = require("fabric-shim");
const ClientIdentity = require("fabric-shim").ClientIdentity;
class AssetTransfer extends Contract {
  async pushStateDevice(ctx, id, datastr) {
    const cid = new ClientIdentity(ctx.stub);
    let mpsid = cid.getMSPID();
    if (
      cid.assertAttributeValue("deviceID", id) &&
      cid.assertAttributeValue("role", "owner") &&
      mpsid === "Org1MSP"
    ) {
      let data = JSON.parse(datastr);
      const asset = {
        deviceID: id,
        ...data,
      };
      return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    } else throw new Error("Access denine");
  }

  // ReadAsset returns the asset stored in the world state with given id.
  async ReadAsset(ctx, id) {
    const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
    if (!assetJSON || assetJSON.length === 0) {
      throw new Error(`The asset ${id} does not exist`);
    }
    return assetJSON.toString();
  }

  // UpdateAsset updates an existing asset in the world state with provided parameters.
  // async updateDevice(ctx, id, datastr) {

  //     let channelid = ctx.stub.getChannelID();
  //     const cid = new ClientIdentity(ctx.stub);
  //     let channelname = cid.getAttributeValue("channelName");

  //     if (cid.assertAttributeValue("channelName", channelid) && cid.assertAttributeValue("role", "writer")) {
  //         const exists = await this.deviceExists(ctx, id);
  //         if (!exists) {
  //             throw new Error(`The asset ${id} does not exist`);
  //         }

  //         let data = JSON.parse(datastr);
  //         // overwriting original asset with new asset
  //         const updatedAsset = {
  //             ID: id,
  //             ...data
  //         };
  //         return ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedAsset)));
  //     } else
  //         throw new Error("Access denine");
  // }

  async deviceExists(ctx, id) {
    const assetJSON = await ctx.stub.getState(id);
    return assetJSON && assetJSON.length > 0;
  }

  async getHistoryDevice(ctx, key) {
    const cid = new ClientIdentity(ctx.stub);
    let mpsid = cid.getMSPID();

    if (cid.assertAttributeValue("deviceID", key) && mpsid === "Org2MSP") {
      if (cid.assertAttributeValue("role", "owner")) {
        //chu so huuu
        const exists = await this.deviceExists(ctx, key);
        if (!exists) {
          throw new Error(`The asset ${key} does not exist`);
        }
        const promiseOfIterator = ctx.stub.getHistoryForKey(key);
        const results = [];
        for await (const keyMod of promiseOfIterator) {
          const resp = {
            timestamp: keyMod.timestamp,
            txid: keyMod.tx_id,
          };
          if (keyMod.is_delete) {
            resp.data = "KEY DELETED";
          } else {
            const obj = JSON.parse(keyMod.value.toString("utf8"));
            resp.data = obj;
          }
          results.push(resp);
        }
        return JSON.stringify(results);
      } else if (cid.assertAttributeValue("role", "refuser")) {
        //nguoi duoc chia se
        const attrfield = JSON.parse(cid.getAttributeValue("refField"));
        const exists = await this.deviceExists(ctx, key);
        if (!exists) {
          throw new Error(`The asset ${key} does not exist`);
        }
        const promiseOfIterator = ctx.stub.getHistoryForKey(key);

        const results = [];
        for await (const keyMod of promiseOfIterator) {
          const resp = {
            timestamp: keyMod.timestamp,
            txid: keyMod.tx_id,
            // attrs : attrfield
          };
          if (keyMod.is_delete) {
            resp.data = "KEY DELETED";
          } else {
            const obj = JSON.parse(keyMod.value.toString("utf8"));
            let temp = {};
            temp["ID"] = obj["ID"];
            temp["timestamp"] = obj["timestamp"];
            temp["battery"] = obj["battery"];
            for (let i of attrfield) {
              if (i.share == true) temp[i.field_name] = obj[i.field_name];
            }
            resp.data = temp;
          }
          results.push(resp);
        }
        return JSON.stringify(results);
      } else {
        throw new Error("Access denine");
      }
    } else throw new Error("Access denine");
  }
  async getStatiscalDevice(ctx, key, startdate, enddate) {
    const cid = new ClientIdentity(ctx.stub);
    let mpsid = cid.getMSPID();

    if (cid.assertAttributeValue("deviceID", key) && mpsid === "Org2MSP") {
      if (cid.assertAttributeValue("role", "owner")) {
        //chu so huuu
        const exists = await this.deviceExists(ctx, key);
        if (!exists) {
          throw new Error(`The asset ${key} does not exist`);
        }
        const promiseOfIterator = ctx.stub.getHistoryForKey(key);
        const results = [];
        for await (const keyMod of promiseOfIterator) {
          const resp = {
            timestamp: keyMod.timestamp,
            txid: keyMod.tx_id,
          };
          if (keyMod.is_delete) {
            resp.data = "KEY DELETED";
          } else {
            const obj = JSON.parse(keyMod.value.toString("utf8"));
            if (obj.timestamp >= startdate && obj.timestamp <= enddate) {
              resp.data = obj;
              results.push(resp);
            }
          }
        }
        return JSON.stringify(results);
      } else if (cid.assertAttributeValue("role", "refuser")) {
        //nguoi duoc chia se
        const attrfield = JSON.parse(cid.getAttributeValue("refField"));
        const exists = await this.deviceExists(ctx, key);
        if (!exists) {
          throw new Error(`The asset ${key} does not exist`);
        }
        const promiseOfIterator = ctx.stub.getHistoryForKey(key);

        const results = [];
        for await (const keyMod of promiseOfIterator) {
          const resp = {
            timestamp: keyMod.timestamp,
            txid: keyMod.tx_id,
            // attrs : attrfield
          };
          if (keyMod.is_delete) {
            resp.data = "KEY DELETED";
          } else {
            const obj = JSON.parse(keyMod.value.toString("utf8"));
            if (obj.timestamp >= startdate && obj.timestamp <= enddate) {
              let temp = {};
              temp["ID"] = obj["deviceID"];
              temp["timestamp"] = obj["timestamp"];
              temp["battery"] = obj["battery"];
              for (let i of attrfield) {
                if (i.share == true) temp[i.field_name] = obj[i.field_name];
              }
              resp.data = temp;
              results.push(resp);
            }
          }
        }
        return JSON.stringify(results);
      } else {
        throw new Error("Access denine");
      }
    } else throw new Error("Access denine");
  }
  // async getHistoryDevice(ctx, key) {
  //     const cid = new ClientIdentity(ctx.stub);
  //     let mpsid = cid.getMSPID();
  //     const attrfield = JSON.parse(cid.getAttributeValue('field'))
  //     if (cid.assertAttributeValue("deviceID", key) && cid.assertAttributeValue('role' , 'refuser') && mpsid === 'Org2MSP') {

  //         const exists = await this.deviceExists(ctx, key);
  //         if (!exists) {
  //             throw new Error(`The asset ${key} does not exist`);
  //         }

  //         const promiseOfIterator = ctx.stub.getHistoryForKey(key);

  //         const results = [];
  //         for await (const keyMod of promiseOfIterator) {
  //             const resp = {
  //                 timestamp: keyMod.timestamp,
  //                 txid: keyMod.tx_id,
  //                 // attrs : attrfield
  //             }
  //             if (keyMod.is_delete) {
  //                 resp.data = 'KEY DELETED';
  //             } else {
  //                 const numfield = attrfield.length
  //                     const obj = JSON.parse(keyMod.value.toString('utf8'))
  //                     let temp = {}
  //                     temp['ID'] = obj['ID']
  //                     temp['timestamp'] = obj['timestamp']
  //                     for(let i of attrfield)
  //                     {
  //                         if(i.share == true)
  //                             temp[i.field_name] = obj[i.field_name]
  //                     }
  //                 // resp.data = keyMod.value.toString('utf8');
  //                 resp.data = temp
  //             }
  //             results.push(resp);
  //         }
  //         return JSON.stringify(results);
  //     } else
  //         throw new Error("Access denine");
  // }

  // GetAllAssets returns all assets found in the world state.
  // async GetAllAssets(ctx) {
  //     const allResults = [];
  //     // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
  //     const iterator = await ctx.stub.getStateByRange('', '');
  //     let result = await iterator.next();
  //     while (!result.done) {
  //         const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
  //         let record;
  //         try {
  //             record = JSON.parse(strValue);
  //         } catch (err) {
  //             console.log(err);
  //             record = strValue;
  //         }
  //         allResults.push({ Key: result.value.key, Record: record });
  //         result = await iterator.next();
  //     }
  //     return JSON.stringify(allResults);
  // }
}

module.exports = AssetTransfer;
