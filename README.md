# Authentication (Node.js + Express)

A simple authentication boilerplate using Node.js, Express, MongoDB (Mongoose), JWTs, email verification, password reset and OTP flows.

## Features
- User registration with optional profile image upload (Multer)
- Login with JWT access and refresh tokens
- Email verification
- Password reset via email
- OTP generation & verification endpoints
- Basic input validation with `express-validator`

## Requirements
- Node.js v16+ (or compatible)
- MongoDB (local or Atlas)

## Quick Start

1. Clone the repo and install dependencies:

```pwsh
cd "https://github.com/erro-rr/Authentication.git"
npm install
```

2. Create a `.env` file in the project root. See the Environment Variables section for required keys.

3. Start the app in development mode:

```pwsh
npm run dev
```

Or start in production mode:

```pwsh
npm start
```

The server entrypoint is `server.js` and the project uses EJS for a few small views in `views/`.

## Environment Variables
Add a `.env` file with at least the following values (names are suggestions used by typical projects in this repo):

- `PORT` — Port the server listens on (e.g. `3000`)
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for signing access tokens
- `REFRESH_TOKEN_SECRET` — Secret for signing refresh tokens
- `EMAIL_HOST` — SMTP host for sending emails
- `EMAIL_PORT` — SMTP port
- `EMAIL_USER` — SMTP username
- `EMAIL_PASS` — SMTP password
- `BASE_URL` — Public base URL used in email links (e.g. `http://localhost:3000`)

Adjust names to match your code if they differ.

## API / Routes
The project mounts two main routers: `routes/authRoute.js` and `routes/userRouter.js`.

Auth routes (`/auth` - as mounted in `server.js`):

- `GET /mail-verification` — Shows mail verification page/view.
- `GET /send-mail-verification` — Sends email verification (uses validator middleware).
- `POST /forgot-password` — Starts password reset flow (sends email).
- `GET /reset-password` — Password reset page (link from email).
- `POST /reset-password` — Submit a new password to update it.
- `GET /reset-success` — Simple success view after password reset.
- `GET /refresh-token` — Refresh access token (protected by refresh token middleware).
- `GET /send-otp` — Generate and send OTP (uses validator).
- `GET /verify-otp` — Verify a received OTP.

User routes (`/user` - as mounted in `server.js`):

- `POST /register` — Register new user; accepts form-data including `image` (profile image).
- `POST /user-login` — User login; returns JWTs on success.
- `GET /user-profile` — Get authenticated user's profile (requires access token).
- `POST /update-user-profile` — Update profile and optionally upload new `image` (authenticated).
- `GET /user-logout` — Logout user (token invalidation/blacklist).

Note: The exact paths may be prefixed depending on how routers are mounted in `server.js` (for example `/api/auth` or `/auth`). Check `server.js` to confirm the mounted base paths.

## Project Structure

High level structure (important files/folders):

- `server.js` — App entrypoint
- `controllers/` — Route handlers (`authController.js`, `userController.js`)
- `routes/` — Express routers (`authRoute.js`, `userRouter.js`)
- `models/` — Mongoose models (users, OTPs, tokens, password resets)
- `helpers/` — Utility helpers (validators, mailer, file delete, OTP validation)
- `middleware/` — Auth and refresh-token middleware
- `public/images` — Uploaded profile images
- `views/` — EJS templates for verification and password reset flow

## Notes & Customization
- Image uploads use `multer` and are stored under `public/images` by default.
- Email sending uses `nodemailer`; set SMTP credentials in `.env`.
- Token blacklisting is supported using a model in `models/blacklistTokenModel.js`.

## Testing
No automated tests are included. To manually test, run the server and exercise endpoints using Postman or curl.


 README.md
