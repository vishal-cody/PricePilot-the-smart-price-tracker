import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPriceDropAlert(
  userEmail,
  product,
  oldPrice,
  newPrice
) {
  try {
    const priceDrop = oldPrice - newPrice;
    const percentageDrop = ((priceDrop / oldPrice) * 100).toFixed(1);

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: userEmail,
      subject: `PricePilot alert: ${product.name} dropped in price`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #0f172a; max-width: 600px; margin: 0 auto; padding: 20px; background: #f6f7f2;">
            <div style="background: #047857; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <p style="color: #d1fae5; margin: 0 0 8px; font-size: 14px; font-weight: 600;">PricePilot</p>
              <h1 style="color: white; margin: 0; font-size: 28px;">Price drop alert</h1>
            </div>
            
            <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              ${
                product.image_url
                  ? `
                <div style="text-align: center; margin-bottom: 20px;">
                  <img src="${product.image_url}" alt="${product.name}" style="max-width: 200px; height: auto; border-radius: 8px; border: 1px solid #e5e7eb;">
                </div>
              `
                  : ""
              }
              
              <h2 style="color: #0f172a; margin-top: 0;">${product.name}</h2>
              
              <div style="background: #ecfdf5; border-left: 4px solid #047857; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #065f46;">
                  <strong>Price dropped by ${percentageDrop}%.</strong>
                </p>
              </div>
              
              <table style="width: 100%; margin: 20px 0;">
                <tr>
                  <td style="padding: 10px; background: #f8fafc; border-radius: 4px;">
                    <div style="font-size: 14px; color: #64748b;">Previous price</div>
                    <div style="font-size: 20px; color: #94a3b8; text-decoration: line-through;">
                      ${product.currency} ${oldPrice.toFixed(2)}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px;">
                    <div style="font-size: 14px; color: #64748b;">Current price</div>
                    <div style="font-size: 32px; color: #047857; font-weight: bold;">
                      ${product.currency} ${newPrice.toFixed(2)}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; background: #dcfce7; border-radius: 4px;">
                    <div style="font-size: 14px; color: #166534;">You save</div>
                    <div style="font-size: 24px; color: #16a34a; font-weight: bold;">
                      ${product.currency} ${priceDrop.toFixed(2)}
                    </div>
                  </td>
                </tr>
              </table>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${product.url}" style="display: inline-block; background: #047857; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Open product
                </a>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 20px; text-align: center; color: #64748b; font-size: 12px;">
                <p>You're receiving this email because this product is saved in your PricePilot watchlist.</p>
                <p style="margin-top: 10px;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #047857; text-decoration: none;">
                    View your watchlist
                  </a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email error:", error);
    return { error: error.message };
  }
}
