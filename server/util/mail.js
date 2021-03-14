const path = require("path");
require('dotenv').config({ path: path.resolve(path.dirname(__dirname), '.env')});
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "outgoing.ccu.edu.tw",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

function send({ to, subject, html, attachments }) {
    const mailOptions = {
        from: process.env.EMAIL_ACCOUNT,
        to,
        subject,
        html,
        attachments
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error);
        console.log(info);
    });
}

module.exports = {
    send
}
