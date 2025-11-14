# Webdevelopment - Zomoto demo

This folder contains a static site and a small Express API to store orders in MongoDB.

Quick start (Windows PowerShell):

1. Install Node.js and MongoDB (or use MongoDB Atlas).

2. Copy `.env.example` to `.env` and update `MONGO_URI` if needed.

3. Install dependencies and run:

```powershell
cd e:\corizo\webdevelopment
npm install
npm run dev   # requires nodemon, or use npm start
```

4. Open the site in your browser:

http://localhost:3000/MENU.HTML

APIs:
- POST `/api/orders` - create order (JSON: { customer, items, subtotal })
- GET `/api/orders` - list orders
- GET `/api/orders/:id` - get one
- PUT `/api/orders/:id` - update
- DELETE `/api/orders/:id` - delete
