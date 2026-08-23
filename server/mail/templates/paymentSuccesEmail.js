// mail/templates/paymentSuccessEmail.js

exports.paymentSuccesEmail = (name, amount, orderId, paymentId) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Payment Successful</title>
  </head>
  <body style="margin:0; padding:0; background-color:#0d0d0d; font-family: Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0d0d; padding: 40px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#161616; border-radius: 12px; overflow: hidden; border: 1px solid #2a2a2a;">
            
            <!-- Header -->
            <tr>
              <td style="background-color:#7C3AED; padding: 28px 32px;">
                <h1 style="margin:0; color:#ffffff; font-size: 22px; letter-spacing: 0.5px;">
                  🎉 Payment Successful
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 32px;">
                <p style="color:#e5e5e5; font-size: 16px; margin: 0 0 16px 0;">
                  Hi <strong style="color:#ffffff;">${name}</strong>,
                </p>
                <p style="color:#b3b3b3; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
                  Thank you for your purchase! Your enrollment has been confirmed and you now have full access to the course. Here are your payment details:
                </p>

                <!-- Details card -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0d0d; border: 1px solid #2a2a2a; border-radius: 8px;">
                  <tr>
                    <td style="padding: 20px 24px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="color:#8a8a8a; font-size: 14px; padding: 6px 0;">Amount Paid</td>
                          <td align="right" style="color:#ffffff; font-size: 14px; font-weight: bold; padding: 6px 0;">₹${amount}</td>
                        </tr>
                        <tr>
                          <td colspan="2" style="border-bottom: 1px solid #2a2a2a; padding: 4px 0;"></td>
                        </tr>
                        <tr>
                          <td style="color:#8a8a8a; font-size: 14px; padding: 6px 0;">Order ID</td>
                          <td align="right" style="color:#ffffff; font-size: 14px; padding: 6px 0;">${orderId}</td>
                        </tr>
                        <tr>
                          <td colspan="2" style="border-bottom: 1px solid #2a2a2a; padding: 4px 0;"></td>
                        </tr>
                        <tr>
                          <td style="color:#8a8a8a; font-size: 14px; padding: 6px 0;">Payment ID</td>
                          <td align="right" style="color:#ffffff; font-size: 14px; padding: 6px 0;">${paymentId}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- CTA -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
                  <tr>
                    <td align="center">
                      <a href="#" style="background-color:#7C3AED; color:#ffffff; text-decoration:none; padding: 12px 32px; border-radius: 6px; font-size: 15px; font-weight: bold; display: inline-block;">
                        Go to My Courses
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="color:#8a8a8a; font-size: 13px; line-height: 1.6; margin: 28px 0 0 0;">
                  If you have any questions about your order, just reply to this email — we're happy to help.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#0d0d0d; padding: 20px 32px; border-top: 1px solid #2a2a2a;">
                <p style="color:#666666; font-size: 12px; margin: 0; text-align: center;">
                  &copy; ${new Date().getFullYear()} fromScratch. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

