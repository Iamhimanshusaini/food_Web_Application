const otpTemplate = (name, otp) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Foodly OTP Verification</title>
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
              max-width: 500px;
              background: #ffffff;
              border-radius: 16px;
              overflow: hidden;
            ">

            <!-- Header -->
            <tr>
              <td align="center"
                style="
                  background: #f97316;
                  padding: 28px 20px;
                  color: #ffffff;
                ">

                <h1 style="margin: 0; font-size: 30px;">
                  🍔 Foodly
                </h1>

                <p style="margin: 8px 0 0; font-size: 14px;">
                  Your favourite food, delivered fresh!
                </p>

              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 35px 28px; color: #333333;">

                <h2 style="margin-top: 0; font-size: 23px;">
                  Verify Your Email Address
                </h2>

                <p style="font-size: 15px; line-height: 1.7;">
                  Hello ${name || "Foodie"},
                </p>

                <p style="font-size: 15px; line-height: 1.7; color: #555555;">
                  Welcome to Foodly! Use the verification code below
                  to verify your email address and continue creating
                  your account.
                </p>

                <!-- OTP -->
                <div style="
                  margin: 28px 0;
                  padding: 22px 10px;
                  text-align: center;
                  background: #fff7ed;
                  border: 1px dashed #f97316;
                  border-radius: 12px;
                ">

                  <p style="
                    margin: 0 0 10px;
                    color: #777777;
                    font-size: 13px;
                    letter-spacing: 1px;
                  ">
                    YOUR VERIFICATION CODE
                  </p>

                  <h1 style="
                    margin: 0;
                    color: #ea580c;
                    font-size: 36px;
                    letter-spacing: 10px;
                  ">
                    ${otp}
                  </h1>

                </div>

                <p style="font-size: 14px; color: #555555; line-height: 1.7;">
                  ⏰ This OTP is valid for <strong>5 minutes</strong>.
                  Please do not share it with anyone.
                </p>

                <p style="font-size: 14px; color: #555555; line-height: 1.7;">
                  If you did not request this verification code,
                  you can safely ignore this email.
                </p>

                <p style="margin-top: 30px; font-size: 15px;">
                  Happy eating! 🍕
                  <br />
                  <strong style="color: #f97316;">
                    Team Foodly
                  </strong>
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="
                padding: 20px;
                background: #f9fafb;
                border-top: 1px solid #eeeeee;
              ">

                <p style="margin: 0; font-size: 12px; color: #888888;">
                  © ${new Date().getFullYear()} Foodly. All rights reserved.
                </p>

                <p style="margin: 8px 0 0; font-size: 12px; color: #888888;">
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

module.exports = otpTemplate;