# Easy ERP - Frontend

The frontend application for Easy ERP built with React 18, Vite, and Ant Design.

## Available Scripts

```bash
yarn dev       # Start development server on http://localhost:3000
yarn build     # Build for production
yarn preview   # Preview production build
yarn lint      # Run ESLint
yarn dev:remote # Connect to remote backend server
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_BACKEND_SERVER` | Backend server URL for remote connections |
| `VITE_DEV_REMOTE` | Set to "remote" to connect to remote backend |

## Proxy Configuration

The development server proxies `/api` requests to `http://localhost:8888` by default. When `VITE_DEV_REMOTE=remote`, it uses `VITE_BACKEND_SERVER` instead.