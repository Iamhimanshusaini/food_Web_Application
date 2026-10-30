
const welcomeTemplate = (name) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to Foodly</title>
  </head>

  <body style="
    margin: 0;
    padding: 0;
    background-color: #f4f5f7;
    font-family: Arial, Helvetica, sans-serif;
  ">

    <table width="100%" cellpadding="0" cellspacing="0"
      style="padding: 35px 10px; background-color: #f4f5f7;">
      <tr>
        <td align="center">

          <table width="100%" cellpadding="0" cellspacing="0"
            style="
              max-width: 520px;
              background: #ffffff;
              border-radius: 16px;
              overflow: hidden;
            ">

            <!-- Header -->
            <tr>
              <td align="center"
                style="
                  background: #f97316;
                  padding: 32px 20px;
                  color: #ffffff;
                ">

                <h1 style="margin: 0; font-size: 34px;">
                  🍔 Foodly
                </h1>

                <p style="margin: 10px 0 0; font-size: 15px;">
                  Delicious food, delivered with love!
                </p>

              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td style="padding: 35px 28px; color: #333333;">

                <h2 style="
                  margin: 0 0 18px;
                  font-size: 26px;
                  color: #ea580c;
                ">
                  Welcome to Foodly! 🎉
                </h2>

                <p style="font-size: 16px; line-height: 1.7;">
                  Hi ${escapeHtml(name || "Foodie")},
                </p>

                <p style="
                  font-size: 15px;
                  color: #555555;
                  line-height: 1.8;
                ">
                  We're thrilled to have you join the Foodly family!
                  Your next delicious meal is just a few clicks away.
                </p>

                <p style="
                  font-size: 15px;
                  color: #555555;
                  line-height: 1.8;
                ">
                  Explore amazing restaurants, discover your favourite
                  dishes, and get delicious food delivered straight
                  to your doorstep.
                </p>

                <!-- Features -->
                <table width="100%" cellpadding="0" cellspacing="0"
                  style="
                    margin: 25px 0;
                    background: #fff7ed;
                    border-radius: 12px;
                  ">

                  <tr>
                    <td style="padding: 18px; font-size: 14px; line-height: 2;">
                      🍕 Discover delicious dishes<br />
                      🏪 Explore amazing restaurants<br />
                      🛵 Enjoy convenient food delivery<br />
                      ❤️ Make every meal special
                    </td>
                  </tr>

                </table>

                <p style="
                  font-size: 15px;
                  line-height: 1.7;
                  color: #555555;
                ">
                  Thank you for choosing Foodly. We can't wait to
                  serve you something delicious!
                </p>

                <!-- CTA -->
                <table width="100%" cellpadding="0" cellspacing="0"
                  style="margin: 28px 0;">
                  <tr>
                    <td align="center">

                      <a href="${process.env.FRONTEND_URL || "https://your-foodly-website.com"}"
                        style="
                          display: inline-block;
                          background: #f97316;
                          color: #ffffff;
                          text-decoration: none;
                          padding: 15px 30px;
                          border-radius: 8px;
                          font-size: 15px;
                          font-weight: bold;
                        ">
                        Explore Foodly 🍽️
                      </a>

                    </td>
                  </tr>
                </table>

                <p style="font-size: 15px; line-height: 1.7;">
                  Happy eating! 😋<br />
                  <strong style="color: #f97316;">
                    Team Foodly
                  </strong>
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center"
                style="
                  padding: 22px 15px;
                  background: #f9fafb;
                  border-top: 1px solid #eeeeee;
                ">

                <p style="margin: 0; font-size: 12px; color: #888888;">
                  © ${new Date().getFullYear()} Foodly. All rights reserved.
                </p>

                <p style="
                  margin: 8px 0 0;
                  font-size: 12px;
                  color: #888888;
                ">
                  Fresh food. Fast delivery. Happy moments.
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

// Prevent HTML injection through the customer's name
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

module.exports = welcomeTemplate;
