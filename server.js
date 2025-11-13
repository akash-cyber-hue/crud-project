const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/menuDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Order Schema
const orderSchema = new mongoose.Schema({
    customerName: String,
    items: [{
        name: String,
        price: Number,
        quantity: Number,
        total: Number
    }],
    subtotal: Number,
    orderDate: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

// API endpoint to save order
app.post('/api/orders', async (req, res) => {
    try {
        const order = new Order({
            customerName: req.body.customerName,
            items: req.body.items,
            subtotal: req.body.subtotal
        });
        
        await order.save();
        res.status(201).json({ message: 'Order saved successfully', orderId: order._id });
    } catch (error) {
        res.status(500).json({ error: 'Error saving order' });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});