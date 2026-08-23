exports.mail =(name,courseName)=>{ 
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Course Enrollment</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f7fb;
      font-family: Arial, sans-serif;
    }

    .container {
      width: 100%;
      padding: 40px 0;
      background-color: #f4f7fb;
    }

    .email-box {
      max-width: 600px;
      margin: auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }

    .header {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: white;
      text-align: center;
      padding: 35px 20px;
    }

    .header h1 {
      margin: 0;
      font-size: 28px;
    }

    .content {
      padding: 40px 30px;
      color: #333333;
      line-height: 1.7;
    }

    .content h2 {
      margin-top: 0;
      color: #111827;
    }

    .highlight {
      color: #4f46e5;
      font-weight: bold;
    }

    .course-card {
      background-color: #f9fafb;
      border-left: 5px solid #4f46e5;
      padding: 18px;
      margin: 25px 0;
      border-radius: 8px;
    }

    .button {
      display: inline-block;
      margin-top: 20px;
      background-color: #4f46e5;
      color: white !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-weight: bold;
    }

    .footer {
      text-align: center;
      padding: 20px;
      font-size: 13px;
      color: #777777;
      background-color: #f9fafb;
    }

    @media screen and (max-width: 600px) {
      .content {
        padding: 25px 20px;
      }

      .header h1 {
        font-size: 24px;
      }
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="email-box">

      <div class="header">
        <h1>Enrollment Successful 🎉</h1>
      </div>

      <div class="content">
        <h2>Hello ${name},</h2>

        <p>
          Congratulations! You have been successfully enrolled in the course.
        </p>

        <div class="course-card">
          <p><strong>Course Name:</strong> ${courseName}</p>
          <p><strong>Enrollment Date:</strong> {date}</p>
        </div>

        <p>
          We’re excited to have you join us on this learning journey.
          Start exploring your course materials and continue building your skills.
        </p>

        <p>
          If you have any questions, feel free to contact our support team anytime.
        </p>

        <a href="{courseLink}" class="button">
          Start Learning
        </a>

        <p style="margin-top: 35px;">
          Best Regards,<br/>
          <span class="highlight">{platformName}</span>
        </p>
      </div>

      <div class="footer">
        © 2026 {platformName}. All rights reserved.
      </div>

    </div>
  </div>
</body>
</html>
```
};