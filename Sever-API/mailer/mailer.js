"use strict";
const nodemailer = require("nodemailer");
const dotenv = require('dotenv')
dotenv.config();
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.AUTHMAILUSER, // generated ethereal user
        pass: process.env.AUTHMAILPASS, // generated ethereal password
    },
});
module.exports.sendmail = async (sender, receiver, text) => {
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"${sender}" <${process.env.AUTHMAILUSER}>`, // sender address
        to: receiver, // list of receivers
        subject: `Request to create a new device from ${sender}`, // Subject line
        text: text, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
}

