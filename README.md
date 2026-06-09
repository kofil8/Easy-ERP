# Easy ERP

A Full-Stack ERP and CRM Application built with React.js, Node.js, and MongoDB.

## Overview

Easy ERP is a comprehensive business management application that provides tools for managing customers, invoices, quotes, payments, and other essential business operations. It's designed as a modular, scalable solution with a modern tech stack.

## Tech Stack

### Frontend

- **React 18** - UI library
- **Vite** - Build tool and development server
- **Redux Toolkit** - State management
- **React Router DOM v6** - Client-side routing
- **Ant Design** - UI component library
- **Axios** - HTTP client for API requests
- **dayjs** - Date utility library
- **React Quill** - Rich text editor

### Backend

- **Node.js** (requires v20+) - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (with Mongoose ODM)
- **JWT** - Authentication
- **Winston** - Logging
- **Morgan** - HTTP request logger
- **Puppeteer** - PDF generation
- **Resend** - Email service integration

## Project Structure

```
easy-erp/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── appControllers/     # CRUD controllers for business entities
│   │   │   ├── coreControllers/     # Core auth and admin controllers
│   │   │   └── middlewaresControllers/
│   │   ├── models/
│   │   │   ├── appModels/           # Business entity models (Client, Invoice, Quote, etc.)
│   │   │   └── coreModels/          # Core models (Admin, Setting, etc.)
│   │   ├── routes/
│   │   │   ├── appRoutes/           # Application API routes
│   │   │   └── coreRoutes/          # Auth and public routes
│   │   ├── middlewares/             # Custom middleware logic
│   │   ├── handlers/               # Error and download handlers
│   │   ├── setup/                   # Initial setup scripts
│   │   └── utils/                   # Utility functions
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/                   # Main application pages
    │   ├── modules/                 # Reusable module components
    │   ├── forms/                   # Form components
    │   ├── router/                  # React Router configuration
    │   ├── request/                 # API request handlers
    │   ├── settings/                # Frontend settings
    │   └── utils/                   # Frontend utilities
    ├── public/
    └── package.json
```

## Features

### Core Modules

1. **Customer Management**
   - Create, read, update, delete customers
   - Search and filter customers
   - Customer assignment tracking

2. **Invoice Management**
   - Create and manage invoices
   - Track payment status (unpaid, paid, partially paid)
   - Invoice statuses: draft, pending, sent, refunded, cancelled, on hold
   - Recurring invoices (daily, weekly, monthly, annually, quarterly)
   - PDF generation for invoices
   - Email invoices to customers

3. **Quote Management**
   - Create and manage quotes
   - Convert quotes to invoices
   - Quote statuses: draft, pending, sent, negotiation, accepted, declined, cancelled
   - PDF generation and email sending

4. **Payment Management**
   - Record payments against invoices
   - Payment status tracking
   - Summary reports

5. **Payment Modes**
   - Configure payment methods (cash, wire transfer, etc.)

6. **Taxes**
   - Configure tax rates
   - Default tax settings

7. **Settings**
   - Application configuration
   - Email templates

### Technical Features

- JWT-based authentication with rate limiting
- Role-based access control (owner role)
- Automatic API route generation based on models
- File upload support
- Audit logging with Winston
- Docker-ready architecture
- Environment-based configuration

## Prerequisites

- Node.js >= 20.x
- MongoDB (local or Atlas)
- Yarn package manager

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/easy-erp.git
cd easy-erp
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB connection and other settings
yarn install
yarn setup  # Creates admin user and default settings
yarn dev    # Start development server on http://localhost:8888
```

### 3. Frontend Setup

```bash
cd ../frontend
cp temp.env .env
# Edit .env with your backend URL if using remote server
yarn install
yarn dev    # Start development server on http://localhost:3000
```

## Environment Variables

### Backend (.env)

| Variable             | Description                               |
| -------------------- | ----------------------------------------- |
| `DATABASE`           | MongoDB connection string                 |
| `JWT_SECRET`         | Secret key for JWT token signing          |
| `PORT`               | Server port (default: 8888)               |
| `NODE_ENV`           | Environment mode (development/production) |
| `RESEND_API`         | Resend API key for email sending          |
| `OPENAI_API_KEY`     | OpenAI API key (optional)                 |
| `PUBLIC_SERVER_FILE` | Public URL for PDF downloads              |

### Frontend (.env)

| Variable              | Description                               |
| --------------------- | ----------------------------------------- |
| `VITE_BACKEND_SERVER` | Backend server URL for remote connections |

## Default Credentials

After running `yarn setup`, the admin account is created:

- Email: `admin@admin.com`
- Password: `admin123`

**Important:** Change the default password immediately after first login.

## API Endpoints

The API follows REST conventions with these base endpoints:

### Authentication

- `POST /api/login` - User login
- `POST /api/forgetpassword` - Request password reset
- `POST /api/resetpassword` - Reset password

### Business Entities (auto-generated routes)

For each entity (client, invoice, quote, payment, paymentMode, taxes):

| Method | Endpoint                   | Description        |
| ------ | -------------------------- | ------------------ |
| POST   | `/api/{entity}/create`     | Create new record  |
| GET    | `/api/{entity}/read/:id`   | Get single record  |
| PATCH  | `/api/{entity}/update/:id` | Update record      |
| DELETE | `/api/{entity}/delete/:id` | Delete record      |
| GET    | `/api/{entity}/search`     | Search records     |
| GET    | `/api/{entity}/list`       | Paginated list     |
| GET    | `/api/{entity}/listAll`    | All records        |
| GET    | `/api/{entity}/filter`     | Filter records     |
| GET    | `/api/{entity}/summary`    | Summary statistics |

### Health Check

- `GET /api/health` - API health status

## Development

### Backend Scripts

```bash
yarn dev           # Start with nodemon (auto-restart)
yarn start         # Production start
yarn setup         # Initialize database with default data
yarn upgrade       # Run upgrade scripts
yarn reset         # Reset database
```

### Frontend Scripts

```bash
yarn dev           # Start Vite dev server on port 3000
yarn build         # Build for production
yarn preview       # Preview production build
yarn lint          # Run ESLint
yarn dev:remote    # Connect to remote backend
```

## Architecture

### Backend Flow

1. **Server Initialization** (`server.js`)
   - Connects to MongoDB
   - Loads all models dynamically
   - Starts Express server

2. **App Configuration** (`app.js`)
   - Configures middleware (CORS, cookies, compression, rate limiting)
   - Registers routes

3. **Dynamic API Generation**
   - Models in `src/models/appModels/` automatically create routes
   - Controllers provide CRUD operations

4. **Authentication**
   - JWT tokens stored in cookies
   - Rate limiting on auth endpoints

### Frontend Flow

1. **Routing** (`src/router/routes.jsx`)
   - Lazy-loaded route components
   - Protected routes via `isValidAuthToken` middleware

2. **CRUD Module**
   - Generic `CrudModule` component handles all entity pages
   - Configurable through `config.js` files in each page directory

3. **State Management**
   - Redux Toolkit for global state
   - Reselect for memoized selectors

## Database Models

### Core Models

- **Admin** - User accounts with role-based access
- **AdminPassword** - Password management with bcrypt hashing
- **Setting** - Application configuration

### App Models

- **Client** - Customer information (name, email, address, phone)
- **Invoice** - Invoices with items, taxes, and payment tracking
- **Quote** - Quotes that can be converted to invoices
- **Payment** - Payment records linked to invoices
- **PaymentMode** - Payment method definitions
- **Taxes** - Tax rate configurations

## License

MIT License

## Author

Mohammed Kofil - mohammedkofil8@gmail.com

---

_Easy ERP - Simple, Efficient, Reliable Business Management_
