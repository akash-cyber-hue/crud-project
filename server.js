require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zomato';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✓ MongoDB connected:', MONGO_URI))
  .catch(err => console.error('✗ MongoDB connection error:', err));

// Order Schema & Model
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  total: { type: Number, required: true }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  items: { type: [ItemSchema], default: [] },
  subtotal: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// ===== API Routes (CRUD) =====

// CREATE - Post a new order
app.post('/api/orders', async (req, res) => {
  try {
    const { customer, items, subtotal } = req.body;
    if (!customer || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid order data' });
    }
    const order = new Order({ customer, items, subtotal });
    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('POST /api/orders error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// READ - Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
    res.json(orders);
  } catch (err) {
    console.error('GET /api/orders error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// READ - Get single order by ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('GET /api/orders/:id error:', err);
    res.status(400).json({ error: 'Invalid order ID' });
  }
});

// UPDATE - Update order by ID
app.put('/api/orders/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/orders/:id error:', err);
    res.status(400).json({ error: 'Invalid order ID or data' });
  }
});

// DELETE - Delete order by ID
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true, message: 'Order deleted' });
  } catch (err) {
    console.error('DELETE /api/orders/:id error:', err);
    res.status(400).json({ error: 'Invalid order ID' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Site: http://localhost:${PORT}/MENU.HTML`);
  console.log(`✓ API: http://localhost:${PORT}/api/orders\n`);
});