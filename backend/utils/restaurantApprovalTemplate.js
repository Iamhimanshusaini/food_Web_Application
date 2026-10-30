const restaurantApprovedTemplate = ({
  ownerName,
  restaurantName,
  dashboardUrl,
}) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:30px;background:#f5f5f5;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;">
    <div style="background:#16a34a;padding:25px;text-align:center;color:white;">
      <h1>🎉 Restaurant Approved!</h1>
      <p>Your Foodly journey starts now.</p>
    </div>

    <div style="padding:30px;color:#333;">
      <h2>Hello ${ownerName},</h2>

      <p>Congratulations! Your restaurant
      <strong>${restaurantName}</strong> has been successfully
      approved by the Foodly Admin Team.</p>

      <p>You can now access your restaurant dashboard and manage
      your menu, restaurant details and orders.</p>

      <div style="background:#dcfce7;padding:15px;border-radius:8px;">
        <strong>Restaurant:</strong> ${restaurantName}<br/>
        <strong>Status:</strong>
        <span style="color:#16a34a;">Approved</span>
      </div>

      <div style="text-align:center;margin:30px 0;">
        <a href="${dashboardUrl}"
        style="background:#f97316;color:white;padding:14px 25px;
        text-decoration:none;border-radius:8px;font-weight:bold;">
          Open Restaurant Dashboard
        </a>
      </div>

      <p>Welcome to the Foodly family!</p>
      <p>Regards,<br/><strong>Foodly Team</strong></p>
    </div>
  </div>
</body>
</html>
`;
module.exports = restaurantApprovedTemplate