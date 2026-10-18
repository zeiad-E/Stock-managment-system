# Stock Management System

A full-stack inventory and point-of-sale system for small shops and warehouses. It tracks products and stock batches, sells to customers, buys from suppliers, handles returns, and reports profit.

## Features

- **Products and stock:** product catalog, stock batches, and search
- **Smart alerts:** low-stock and expiring-soon warnings
- **Point of sale:** sell to customers and generate customer bills
- **Purchasing:** buy from suppliers and record supplier bills
- **Returns** handling
- **Customers and suppliers** management
- **Reports:** sales and purchase history, total profit, and monthly profit charts
- **Authentication:** JWT-protected API with bcrypt-hashed passwords

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React, Chart.js, Axios, CSS Modules |
| Backend | Node.js, Express, JWT, bcrypt |
| Database | MongoDB (Mongoose) for inventory data, SQLite for user accounts |

## API overview

| Area | Endpoints |
|---|---|
| Auth | `POST /register`, `POST /login` |
| Products | create, list, search, get, delete |
| Customers / Suppliers | create, list, search, delete |
| Stock | list and create batches, low-stock alerts, expiring-soon alerts |
| Transactions | sell to customer, buy from supplier, returns, bill history |
| Stats | profit, monthly profit |

## Run locally

```bash
# Backend: copy .env.example to .env and fill in your values
cd backend
npm install
node server.js

# Frontend
cd frontend
npm install
npm start
```

## Author

**Zeiad Emad**: [LinkedIn](https://www.linkedin.com/in/zeiad-emad/) · [GitHub](https://github.com/zeiad-E)
