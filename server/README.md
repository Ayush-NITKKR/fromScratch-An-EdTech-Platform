# EdTech - Project Day 1

Date: Day 1 (initial setup)

This README summarizes what was completed on Day 1 of the EdTech project.

## What was done (Day 1)

- Project initialized with package.json and required dependencies.
- Project root files and folders created:
  - `index.js` (entry point — currently empty)
  - `package.json` (npm scripts: `start`, `dev`)
  - `.env` (environment file placeholder)
  - `config/` (contains `db.js`)
  - `controller/` (contains `Auth.js`, `ResetPassword.js`)
  - `middleware/` (contains `Auth.js`)
  - `model/` (user, course, course progress, profile, etc.)
  - `routes/` (currently empty — to be added)
  - `utils/` (contains `mailSender.js`)

## Implemented features & files

- Authentication controller scaffold: `controller/Auth.js` (OTP, sign-up, login comments present).
- Reset password controller file created: `controller/ResetPassword.js` (empty placeholder).
- Email helper implemented: `utils/mailSender.js` — a nodemailer wrapper which reads SMTP credentials from environment variables and sends email with subject and HTML body.
- User model: `model/User.js` — Mongoose schema with fields: `firstName`, `lastName`, `email`, `password`, `accountType`, `additionalDetails` (ref `profile`), `courses`, `image`, `courseProgress`.
- Other Mongoose models present (skeletons/definitions): `Course.js`, `CourseProgress.js`, `Profile.js`, `RatingAndReview.js`, `Section.js`, `SubSection.js`, `tags.js`, `otp.js`.
- Middleware: `middleware/Auth.js` exists (authentication middleware).

## Dependencies (from package.json)

- bcrypt
- cookie-parser
- dotenv
- jsonwebtoken
- mongoose
- nodemailer
- nodemon (dev)
- otp-generator

## How to run (local)

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with the following variables:

- MAIL_HOST
- MAIL_ID
- MAIL_PASS
- (add other DB and JWT related env variables as needed)

3. Start the server in development mode:

```bash
npm run dev
```

Or to run normally:

```bash
npm start
```

Note: `index.js` is the application entry point and is currently empty; you'll need to wire up the express app, database connection (`config/db.js`), and routes.


- Many controller/model files are present but incomplete. This Day 1 summary reflects the initial scaffolding and the email helper implementation.


## Day 2
 - we are going to work on the CRUD operations like create the coruse so to this we

- tags banane hai controller Jo ki (admin bs bna skta h)
  - 1 . create tag controller
  - 2 . showAlltag
- sections 
- subsections

---
