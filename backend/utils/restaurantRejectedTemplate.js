const restaurantRejectedTemplate = ({
    ownerName,
    restaurantName,
    rejectionReason,
    supportEmail,
}) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:30px;background:#f5f5f5;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;">
    <div style="background:#dc2626;padding:25px;text-align:center;color:white;">
      <h1>Restaurant Application Update</h1>
      <p>Foodly Admin Team</p>
    </div>

    <div style="padding:30px;color:#333;">
      <h2>Hello ${ownerName},</h2>

      <p>Thank you for registering
      <strong>${restaurantName}</strong> on Foodly.</p>

      <p>Unfortunately, after reviewing your application,
      we are unable to approve your restaurant at this time.</p>

      <div style="background:#fee2e2;padding:15px;border-radius:8px;">
        <strong>Restaurant:</strong> ${restaurantName}<br/>
        <strong>Status:</strong>
        <span style="color:#dc2626;">Rejected</span><br/><br/>

        <strong>Reason for rejection:</strong><br/>
        ${rejectionReason || "Please contact our support team for details."}
      </div>

      <p style="margin-top:25px;">
        If you have any questions or need clarification,
        please contact our support team.
      </p>

      <p>Support Email: ${supportEmail}</p>

      <p>Regards,<br/><strong>Foodly Team</strong></p>
    </div>
  </div>
</body>
</html>
`;

module.exports = restaurantRejectedTemplate