exports.mailTemplate = ({
  first_name,
  last_name,
  email,
  phoneNumber,
  message,
}) => {
  return `
    <h2>New Contact Request</h2>

    <p><strong>First Name:</strong> ${first_name}</p>
    <p><strong>Last Name:</strong> ${last_name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone Number:</strong> ${phoneNumber}</p>

    <h3>Message:</h3>
    <p>${message}</p>
  `;
};
exports.confirmationMail = ({
  first_name,
  last_name,
  email,
  phoneNumber,
  message,
}) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>We Have Received Your Message</h2>

      <p>Hello ${first_name},</p>

      <p>
        Thank you for contacting us.
        Our team has successfully received your message and
        will get back to you soon.
      </p>

      <h3>Your Submitted Details:</h3>

      <p><strong>Name:</strong> ${first_name} ${last_name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${phoneNumber}</p>

      <h3>Your Message:</h3>
      <p>${message}</p>

      <p>Thank you for reaching out to us.</p>

      <p>Best Regards,<br/>Support Team</p>
    </div>
  `;
};

