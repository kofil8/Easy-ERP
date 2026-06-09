# Easy-ERP Backend

The backend API server for Easy-ERP CRM, built with Express.js and MongoDB (Mongoose).

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Templating**: Pug
- **PDF Generation**: Puppeteer
- **File Storage**: AWS S3 (via `@aws-sdk/client-s3`)
- **Email**: Resend
- **AI**: OpenAI API (optional)
- **Linting**: ESLint + Prettier

## Project Structure

```
src/
├── app.js              # Express app setup
├── server.js           # Server entry point
├── controllers/        # Route controllers (business logic)
├── handlers/           # Request handlers
├── emailTemplate/      # Email templates
├── helpers.js          # Utility helpers
├── locale/             # i18n locale files
├── middlewares/        # Express middlewares
├── models/             # Mongoose models
├── pdf/                # PDF generation logic
├── public/             # Static files
├── routes/             # Route definitions
├── settings/           # App settings/constants
├── setup/              # DB setup, upgrade, reset scripts
├── utils/              # Shared utilities
```

## Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)

## Installation

```bash
# Install dependencies
yarn install
```

## Environment Configuration

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:

| Variable | Description |
|----------|-------------|
| `DATABASE` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT token signing |
| `PORT` | Server port (default: 8888) |
| `NODE_ENV` | Environment (`development` / `production`) |
| `RESEND_API` | Resend API key for sending emails |
| `OPENAI_API_KEY` | (Optional) OpenAI API key |
| `PUBLIC_SERVER_FILE` | Public URL for file serving (e.g. `http://localhost:8888/`) |

## Running the Server

```bash
# Development mode (with nodemon)
yarn dev

# Production mode
yarn start
```

## Database Setup

```bash
# Initial setup (seeds default data)
yarn setup

# Upgrade database (migrations)
yarn upgrade

# Reset database (WARNING: drops all data)
yarn reset
```

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Start | `yarn start` | Run server with Node |
| Dev | `yarn dev` | Run server with Nodemon |
| Setup | `yarn setup` | Initialize database |
| Upgrade | `yarn upgrade` | Run DB migrations |
| Reset | `yarn reset` | Reset database |
