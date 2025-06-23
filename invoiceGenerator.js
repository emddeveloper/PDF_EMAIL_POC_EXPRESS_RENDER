// invoiceGenerator.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateInvoice(data, filePath) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(filePath);

        doc.pipe(writeStream);

        doc.fontSize(20).text("Invoice", { align: "center" });
        doc.moveDown();

        doc.fontSize(12).text(`Customer: ${data.customer}`);
        doc.text(`Date: ${new Date().toLocaleDateString()}`);
        doc.moveDown();

        doc.text("Items:");
        data.items.forEach(item => {
            doc.text(`${item.name} - ₹${item.price}`);
        });

        doc.moveDown();
        doc.text(`Total: ₹${data.total}`, { bold: true });

        doc.end();

        writeStream.on('finish', () => resolve(filePath));
        writeStream.on('error', reject);
    });
}

module.exports = { generateInvoice };
