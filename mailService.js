// mailService.js
const nodemailer = require('nodemailer');

async function sendInvoiceEmail(toEmail, filePath) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'emd.developer@gmail.com',
            pass: 'skaminulislam'
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
