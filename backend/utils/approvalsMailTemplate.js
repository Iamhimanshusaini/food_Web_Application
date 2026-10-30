const restaurantApprovalTemplate = ({
    restaurantName,
    ownerName,
    email,
    phone,
    address,
    dashboardUrl,
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Restaurant Approval Request</title>
</head>

<body style="margin:0; padding:0; background:#f4f5f7; font-family:Arial,sans-serif;">

  <div style="max-width:600px; margin:30px auto; background:#ffffff;
              border-radius:14px; overflow:hidden;">

    <div style="background:#f97316; padding:25px; text-align:center;">
      <h1 style="color:#ffffff; margin:0; font-size:28px;">
        Foodly
      </h1>
      <p style="color:#fff7ed; margin:8px 0 0;">
        Restaurant Approval Request
      </p>
    </div>

    <div style="padding:30px; color:#334155;">

      <h2 style="color:#0f172a; margin-top:0;">
        New Restaurant Registration 🎉
      </h2>

      <p>Hello Super Admin,</p>

      <p style="line-height:1.7;">
        A new restaurant has registered on Foodly and is waiting
        for your approval. Please review its details below.
      </p>

      <div style="background:#fff7ed; border:1px solid #fed7aa;
                  border-radius:10px; padding:20px; margin:24px 0;">

        <h3 style="margin-top:0; color:#9a3412;">
          Restaurant Details
        </h3>

        <p><strong>Restaurant Name:</strong> ${restaurantName}</p>
        <p><strong>Owner Name:</strong> ${ownerName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}</p>

        <p>
          <strong>Status:</strong>
          <span style="color:#c2410c; font-weight:bold;">
            Pending Approval
          </span>
        </p>
      </div>

      <p style="line-height:1.7;">
        Please open your Super Admin dashboard to review this
        registration and approve or reject the restaurant.
      </p>

      <div style="text-align:center; margin:30px 0;">
        <a href="${dashboardUrl}"
           style="display:inline-block; background:#f97316;
                  color:#ffffff; text-decoration:none;
                  padding:14px 24px; border-radius:8px;
                  font-weight:bold;">
          Open Super Admin Dashboard
        </a>
      </div>

      <p style="font-size:13px; color:#64748b; line-height:1.6;">
        This is an automated notification from Foodly.
        Please do not reply to this email.
      </p>

    </div>

    <div style="background:#f8fafc; padding:18px;
                text-align:center; color:#94a3b8; font-size:12px;">
      © ${new Date().getFullYear()} Foodly. All rights reserved.
    </div>

  </div>

</body>
</html>
`;
module.exports = restaurantApprovalTemplate