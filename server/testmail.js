let nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');
let transporter = nodemailer.createTransport(smtpTransport({
host: 'localhost',
port: 25
}))

transporter.verify(function(error, success){
if(error){
console.log(error)
} else {
console.log('success')
}
});

transporter.sendMail({
from: 'noreply@webgears.org',
to: 'vladimir.gartsev@gmail.com',
subject: 'test',
text: 'test text'
})
