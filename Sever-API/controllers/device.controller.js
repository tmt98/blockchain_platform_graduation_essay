const jwt = require("jsonwebtoken");
const log4js = require("log4js");
const logger = log4js.getLogger("APP.JS");
const helper = require("../helper/helper");
const device = require("../helper/device.app");
const constants = require("../config/constans.json");
const { Parser } = require("json2csv");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
const getErrorMessage = () => {
  let respone = {
    success: false,
    message: "Some field is missing or Invalid in the request",
  };
  return respone;
};
const client = require("twilio")(process.env.ACCOUNTSID, process.env.AUTHTOKEN);

import { record } from "../app";
import { db } from "../fbadim/fb-hook";

module.exports.getDataDevice = async (req, res) => {
  const { bcIdentity, deviceID } = req.decoded;
  if (!bcIdentity || !deviceID) {
    res.status(401).json(getErrorMessage());
    return;
  }

  try {
    let response_payload = await device.getDataDevice(bcIdentity, deviceID);
    const temp = response_payload.slice(0, 25);
    res.send(temp);
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

module.exports.getDataStatisticalDevice = async (req, res) => {
  const { bcIdentity, deviceID } = req.decoded;
  const { startDate, endDate } = req.body;
  console.log("toi da");
  console.log(bcIdentity, deviceID, startDate, endDate);
  if (!bcIdentity || !deviceID || !startDate || !endDate) {
    res.status(401).json(getErrorMessage());
    return;
  }
  console.log("toi day ne");
  try {
    let response_payload = await device.getDataStatisticalDevice(
      bcIdentity,
      deviceID,
      startDate,
      endDate
    );
    console.log(response_payload.length);
    res.send(response_payload);
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};
module.exports.downloadDataStatisticalDevice = async (req, res) => {
  const { bcIdentity, deviceID } = req.decoded;
  const { startDate, endDate } = req.body;
  console.log("toi da");
  console.log(bcIdentity, deviceID, startDate, endDate);
  if (!bcIdentity || !deviceID || !startDate || !endDate) {
    res.status(401).json(getErrorMessage());
    return;
  }
  console.log("toi day ne");
  try {
    let response_payload = await device.getDataStatisticalDevice(
      bcIdentity,
      deviceID,
      startDate,
      endDate
    );
    console.log(response_payload.length);
    const temp = response_payload[0].data;
    let fields = [];
    for (const i in temp) {
      console.log(i);
      fields.push({ label: i, value: i });
    }
    const getdata = response_payload.map((item) => item.data);
    const x = new Parser({ fields });
    const content = x.parse(getdata);
    console.log(content);

    // const result = await fs.writeFile(`./data.csv`, content);
    res.header("Content-Type", "text/csv");
    res.attachment("data.csv");
    res.send(content);
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

module.exports.pushDataDevice = async (req, res) => {
  const body = req.body;
  const { ID } = body;
  const identity = req.identity;
  if (!ID || !identity) {
    res.status(401).json(getErrorMessage());
    return;
  }
  // body.timestamp = new Date(body.timestamp * 1000).toLocaleString();
  // body.timestamp = Math.ceil(new Date().getTime() / 1000);
  delete body.ID;
  const data = {
    ...body,
  };
  console.log(data);
  for (let i in data) {
    if (typeof data[i] === "string") data[i] = JSON.parse(data[i]);
  }
  console.log(data);
  db.collection("devices")
    .doc(ID)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const device = doc.data();
        if (device.warning === true) {
          let message = "";
          const phonenumber = device.phone_number;
          for (const field of device.data_fields) {
            if (data[field.field_name] < field.min) {
              message += `${field.field_display} vượt mức cảnh báo (${
                data[field.field_name]
              } < ${field.min})\n`;
            }
            if (data[field.field_name] > field.max) {
              message += `${field.field_display} vượt mức cảnh báo (${
                data[field.field_name]
              } > ${field.max})\n`;
            }
          }
          console.log(message);
          if (message !== "") {
            // db.collection("notifications").add({
            //   deviceID: ID,
            //   message: message,
            // });
            client.messages
              .create({
                body:
                  `Thông báo từ thiết bị ${doc.id}\nVào lúc ${new Date(
                    body.timestamp * 1000
                  ).toLocaleString()}\n` + message,
                from: "+12315977969",
                to: phonenumber,
              })
              .then((message) => console.log(message.sid));
          }
        }
      }
    });
  try {
    let response_payload = await device.pushDataDevice(identity, ID, data);
    record.set(`news/${ID}`, data);
    res.json({ data: response_payload });
  } catch (e) {
    console.log("day ne", e);
    res.status(403).json({ success: false, message: e.message });
  }
};

module.exports.pushDataDeviceTestWaspmost = async (req, res) => {
  const body = req.body;
  const { ID } = body;
  const identity = req.identity;
  if (!ID || !identity) {
    res.status(401).json(getErrorMessage());
    return;
  }
  // body.timestamp = new Date(body.timestamp * 1000).toLocaleString();
  // body.timestamp = Math.ceil(new Date().getTime() / 1000);
  delete body.ID;
  const data = {
    ...body,
  };
  console.log(data);
  for (let i in data) {
    if (typeof data[i] === "string") data[i] = JSON.parse(data[i]);
  }
  console.log(data);
  db.collection("devices")
    .doc(ID)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const device = doc.data();
        if (device.warning === true) {
          let message = "";
          const phonenumber = device.phone_number;
          for (const field of device.data_fields) {
            if (data[field.field_name] < field.min) {
              message += `${field.field_display} vượt mức cảnh báo (${
                data[field.field_name]
              } < ${field.min})\n`;
            }
            if (data[field.field_name] > field.max) {
              message += `${field.field_display} vượt mức cảnh báo (${
                data[field.field_name]
              } > ${field.max})\n`;
            }
          }
          console.log(message);
          if (message !== "") {
            // db.collection("notifications").add({
            //   deviceID: ID,
            //   message: message,
            // });
            client.messages
              .create({
                body:
                  `Thông báo từ thiết bị ${doc.id}\nVào lúc ${new Date(
                    body.timestamp * 1000
                  ).toLocaleString()}\n` + message,
                from: "+12315977969",
                to: phonenumber,
              })
              .then((message) => console.log(message.sid));
          }
        }
      }
    });
  try {
    let response_payload = await device.pushDataDevice(identity, ID, data);
    record.set(`news/${ID}`, data);
    res.json({ data: response_payload });
  } catch (e) {
    console.log("day ne", e);
    res.status(403).json({ success: false, message: e.message });
  }
};

// module.exports.pushDataDeviceTestWaspmost = async (req, res) => {
//   const body = req.body;
//   const { ID } = body;
//   const identity = req.identity;
//   if (!ID || !identity) {
//     res.status(401).json(getErrorMessage());
//     return;
//   }
//   // body.timestamp = new Date(body.timestamp * 1000).toLocaleString();
//   // body.timestamp = Math.ceil(new Date().getTime() / 1000);
//   console.log(new Date(body.timestamp * 1000).toLocaleString());
//   delete body.ID;
//   const data = {
//     ...body,
//   };
//   console.log(data);
//   for (let i in data) {
//     if (typeof data[i] === "string") data[i] = JSON.parse(data[i]);
//   }
//   console.log(data);
//   return res.status(200).json({
//     message: "Successful",
//     data,
//   });
//   // db.collection("devices")
//   //   .doc(ID)
//   //   .get()
//   //   .then((doc) => {
//   //     if (doc.exists) {
//   //       const device = doc.data();
//   //       if (device.warning === true) {
//   //         let message = "";
//   //         const phonenumber = device.phone_number;
//   //         for (const field of device.data_fields) {
//   //           if (data[field.field_name] < field.min) {
//   //             message += `${field.field_display} vượt mức cảnh báo (${
//   //               data[field.field_name]
//   //             } < ${field.min})\n`;
//   //           }
//   //           if (data[field.field_name] > field.max) {
//   //             message += `${field.field_display} vượt mức cảnh báo (${
//   //               data[field.field_name]
//   //             } > ${field.max})\n`;
//   //           }
//   //         }

//   //         if (message !== "") {
//   //           client.messages
//   //             .create({
//   //               body:
//   //                 "This is the ship that made the Kessel Run in fourteen parsecs?",
//   //               from: "+84392597878",
//   //               to: phonenumber,
//   //             })
//   //             .then((message) => console.log(message.sid));
//   //         }
//   //       }
//   //     }
//   //   });
//   // console.log(data);
//   // try {
//   //   let response_payload = await device.pushDataDevice(identity, ID, data);
//   //   record.set(`news/${ID}`, data);
//   //   res.json({ data: response_payload });
//   // } catch (e) {
//   //   console.log("day ne", e);
//   //   res.send(e);
//   // }
// };

module.exports.getDeviceField = async (req, res) => {
  const { bcIdentity } = req.decoded;
  if (!bcIdentity) {
    res.status(401).json(getErrorMessage());
    return;
  }
  try {
    const attrs = await helper.getAttrsUSer(bcIdentity);
    const deviceInfo = attrs.find((item) => item.name === "deviceInfo");
    let attrFields = attrs.find((item) => item.name === "refField");
    attrFields = JSON.parse(attrFields.value);
    let fields = [];
    for (let field of attrFields) {
      if (field.share === true) fields.push(field);
    }
    console.log(fields);
    const result = {
      deviceInfo: JSON.parse(deviceInfo.value),
      data_fields: fields,
    };
    res.json({ success: true, data: result });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
