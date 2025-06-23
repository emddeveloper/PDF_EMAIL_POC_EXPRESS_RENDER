// mailService.js
const nodemailer = require('nodemailer');

async function sendInvoiceEmail(toEmail, filePath) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: 'emd.developer@gmail.com',
        to: toEmail,
        subject: 'Your Invoice',
        text: 'Please find the attached invoice.',
        attachments: [
            {
                filename: 'invoice.pdf',
                path: filePath
            }
        ]
    };

    return transporter.sendMail(mailOptions);
}

module.exports = { sendInvoiceEmail };
