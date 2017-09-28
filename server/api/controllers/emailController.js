const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const transporter = nodemailer.createTransport(smtpTransport({
        host: 'localhost',
        port: 587,
        secure: false,
        ignoreTLS: true
      }));

exports.address = {
    noreply: 'noreply@webgears.org'
}
exports.transporter = transporter
exports.getHostUrl = function (req) {
    return req.protocol + '://' + req.get('host');
}