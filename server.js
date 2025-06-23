// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { generateInvoice } = require('./invoiceGenerator');
const { sendInvoiceEmail } = require('./mailService');

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve static PDFs
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));

app.post('/create-invoice', async (req, res) => {
    try {
        const { customer, items, email } = req.body;

        const total = items.reduce((acc, curr) => acc + curr.price, 0);
        const invoiceData = { customer, items, total };

        const fileName = `invoice-${Date.now()}.pdf`;
        const filePath = path.join(__dirname, 'invoices', fileName);

        await generateInvoice(invoiceData, filePath);
        await sendInvoiceEmail(email, filePath);

        const downloadUrl = `${req.protocol}://${req.get('host')}/invoices/${fileName}`;

        res.json({
            message: 'Invoice created, emailed, and available for download',
            downloadUrl
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error generating or sending invoice');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
