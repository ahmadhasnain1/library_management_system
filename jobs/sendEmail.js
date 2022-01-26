const mailer = require('nodemailer');
const cron = require('node-cron');

// Creating a transporter
const transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ahmad.hasnain@invozone.com',
        pass: ''
    }
});

function sendEmail(receiver_email, sender_email, message){
    //sending the email
    transporter.sendMail({
        from: sender_email,
        to: receiver_email,
        subject: 'Registration',
        text: message
    })
        .then(_ => {console.log("Email sent on " + new Date())})
        .catch(error => {console.log(error)});
}

const scheduleEmail = (receiver_email, sender_email, library_name, res) => {
    try{
        cron.schedule('*/10 * * * *', sendEmail(receiver_email, sender_email, "You are added in a library "+ library_name));
    }catch(e){
        console.log(e);
    }
}

module.exports = {
    scheduleEmail
}
