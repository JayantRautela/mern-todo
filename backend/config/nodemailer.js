const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.USER_EMAIL,
        pass : process.env.USER_PASSWORD
    }
});

function sendEmail (email) {
    const mailOptions =  {
        from: process.env.USER_EMAIL,
        to: email,
        subject: 'Welcome To Todos App',
        text: 'Create and Organize your Todos With Us....' 
    };

    return transporter.sendMail(mailOptions);
}

module.exports = sendEmail;