const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require('path');
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

async function generateInvoice(data, filePath) {

  // Read the HTML template
  const templatePath = path.join(__dirname, 'template.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  // Replace placeholders in the template with data from the request body
  html = html.replace('{{invoiceNo}}', data.invoiceNo || '')
             .replace('{{invoiceDate}}', data.invoiceDate || '')
             .replace('{{buyerName}}', data.buyer?.name || '')
             .replace('{{buyerAddress}}', data.buyer?.address || '')
             .replace('{{buyerState}}', data.buyer?.state || '')
             .replace('{{buyerMobile}}', data.buyer?.mobile || '')
             .replace('{{buyerEmail}}', data.buyer?.email || '')
             .replace('{{consigneeName}}', data.consignee?.name || '')
             .replace('{{consigneeAddress}}', data.consignee?.address || '')
             .replace('{{consigneeState}}', data.consignee?.state || '')
             .replace('{{consigneeMobile}}', data.consignee?.mobile || '')
             .replace('{{consigneeEmail}}', data.consignee?.email || '')
             .replace('{{sgstRate}}', data.sgstRate || '')
             .replace('{{cgstRate}}', data.cgstRate || '')
             .replace('{{sgstAmount}}', data.sgstAmount || '')
             .replace('{{cgstAmount}}', data.cgstAmount || '')
             .replace('{{totalAmount}}', data.totalAmount || '')
             .replace('{{amountWords}}', data.amountWords || '');

  // Items table
  if (data.items && Array.isArray(data.items)) {
    const itemsHtml = data.items.map((item, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>${item.unit}</td>
        <td>${item.price}</td>
        <td>${(item.qty * item.price).toFixed(2)}</td>
      </tr>
    `).join('');
    html = html.replace('{{itemsRows}}', itemsHtml);
  }

  // Serial numbers
  if (data.serialNumbers && Array.isArray(data.serialNumbers)) {
    const serialsHtml = data.serialNumbers.map(sn => `<li>${sn}</li>`).join('');
    html = html.replace('{{serialNumbers}}', serialsHtml);
  }

  // Launch puppeteer and generate PDF
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ path: filePath, format: 'A4', printBackground: true });
  await browser.close();

  return filePath;
}

module.exports = { generateInvoice };
