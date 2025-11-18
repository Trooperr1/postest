import { t } from './translations';

/**
 * Format number as currency in Kurdish
 */
export const formatCurrency = (amount) => {
  return `${amount.toLocaleString('en-US')} ${t('common.currency')}`;
};

/**
 * Format date in Kurdish style
 */
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB');
};

/**
 * Format time
 */
export const formatTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

/**
 * Generate receipt HTML for thermal printer (80mm width)
 */
export const generateReceiptHTML = (saleData) => {
  const { items, subtotal, tax = 0, total, date } = saleData;

  const receiptHTML = `
    <div class="receipt-print" dir="rtl" style="width: 80mm; font-family: 'Courier New', monospace; padding: 10px;">
      <!-- Store Header -->
      <div style="text-align: center; margin-bottom: 15px; border-bottom: 2px dashed #000; padding-bottom: 10px;">
        <h2 style="font-size: 24px; font-weight: bold; margin: 0;">${t('receipt.storeName')}</h2>
        <p style="margin: 5px 0; font-size: 14px;">سیستەمی فرۆشتن</p>
      </div>

      <!-- Date and Time -->
      <div style="text-align: center; margin-bottom: 15px; font-size: 12px;">
        <p style="margin: 3px 0;">${t('receipt.date')}: ${formatDate(date)}</p>
        <p style="margin: 3px 0;">${t('receipt.time')}: ${formatTime(date)}</p>
      </div>

      <!-- Items Table -->
      <div style="border-top: 2px dashed #000; border-bottom: 2px dashed #000; padding: 10px 0;">
        <table style="width: 100%; font-size: 14px; direction: rtl;">
          <thead>
            <tr style="border-bottom: 1px solid #000;">
              <th style="text-align: right; padding: 5px;">${t('receipt.item')}</th>
              <th style="text-align: center; padding: 5px;">${t('receipt.quantity')}</th>
              <th style="text-align: right; padding: 5px;">${t('receipt.total')}</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td style="text-align: right; padding: 5px;">${item.name}</td>
                <td style="text-align: center; padding: 5px;">${item.quantity}</td>
                <td style="text-align: right; padding: 5px;">${formatCurrency(item.price * item.quantity)}</td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right; padding: 0 5px 5px 5px; font-size: 12px; color: #666;">
                  ${formatCurrency(item.price)} × ${item.quantity}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div style="margin-top: 15px; font-size: 14px;">
        <div style="display: flex; justify-content: space-between; padding: 5px 0;">
          <span style="font-weight: bold;">${t('receipt.subtotal')}:</span>
          <span>${formatCurrency(subtotal)}</span>
        </div>
        ${tax > 0 ? `
          <div style="display: flex; justify-content: space-between; padding: 5px 0;">
            <span style="font-weight: bold;">${t('receipt.tax')}:</span>
            <span>${formatCurrency(tax)}</span>
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-top: 2px solid #000; margin-top: 5px; font-size: 18px; font-weight: bold;">
          <span>${t('receipt.grandTotal')}:</span>
          <span>${formatCurrency(total)}</span>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 20px; border-top: 2px dashed #000; padding-top: 15px;">
        <p style="font-size: 16px; font-weight: bold; margin: 5px 0;">${t('receipt.thankYou')}</p>
        <p style="font-size: 14px; margin: 5px 0;">${t('receipt.footer')}</p>
      </div>
    </div>
  `;

  return receiptHTML;
};

/**
 * Print receipt using browser print API
 */
export const printReceipt = (saleData) => {
  // Create a hidden iframe for printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';

  document.body.appendChild(iframe);

  const receiptHTML = generateReceiptHTML(saleData);

  // Write the receipt HTML to the iframe
  const iframeDoc = iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>${t('receipt.title')}</title>
      <style>
        @page {
          size: 80mm auto;
          margin: 0;
        }
        body {
          margin: 0;
          padding: 0;
        }
        * {
          box-sizing: border-box;
        }
      </style>
    </head>
    <body>
      ${receiptHTML}
    </body>
    </html>
  `);
  iframeDoc.close();

  // Wait for content to load, then print
  iframe.contentWindow.onload = () => {
    setTimeout(() => {
      iframe.contentWindow.print();

      // Remove iframe after printing
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 100);
    }, 250);
  };
};

/**
 * Generate receipt preview HTML (for display before printing)
 */
export const getReceiptPreview = (saleData) => {
  return generateReceiptHTML(saleData);
};
