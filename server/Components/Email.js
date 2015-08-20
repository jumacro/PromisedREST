var nodemailer = require('nodemailer');

/*exports.Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mithun.programmer@gmail.com',
        pass: 'RottenEgg123$'
    }
});*/

exports.Transporter = nodemailer.createTransport();