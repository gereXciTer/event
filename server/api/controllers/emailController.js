const SparkPost = require('sparkpost');
const client = new SparkPost();



// const nodemailer = require('nodemailer');
// const smtpTransport = require('nodemailer-smtp-transport');
// const transporter = nodemailer.createTransport(smtpTransport({
//         host: 'localhost',
//         port: 587,
//         secure: false,
//         ignoreTLS: true
//       }));

exports.address = {
	noreply: 'noreply@mail.webgears.org'
}
exports.transporter = {
	sendMail: function (options, cb) {
		client.transmissions.send({
			options: {
				sandbox: false
			},
			content: {
				from: options.from,
				subject: options.subject,
				html: options.html
			},
			recipients: [
				{address: options.to}
			]
		})
		.then(data => {
			if(cb && typeof cb == 'function') {
				cb(data);
			}
		})
		.catch(err => {
			console.log('Whoops! Something went wrong');
			console.log(err);
		});
	}
}
exports.getHostUrl = function (req) {
	return req.protocol + '://' + req.get('host');
}