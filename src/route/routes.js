const express = require('express');
const router = express.Router();
const { Client } = require('pg');

// Configure your PostgreSQL connection
const db = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'DPP',
  password: '1234',
  port: 5432, // Change it according to your PostgreSQL configuration
});

db.connect(); // Connect to the PostgreSQL database

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  // Replace the placeholder with your actual authentication logic
  const user = true; // Example: Check if the user is authenticated
  if (user) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Define your APIs

// Get all users (for testing)
router.get('/users', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id; // Assuming you have a user object with an id property
  
      const result = await db.query('SELECT * FROM orders WHERE user_id = $1', [userId]);
  
      res.json({ orders: result.rows });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});  

// Place an order
router.post('/orders', isAuthenticated, async (req, res) => {
  try {
    const orders = req.body;

    // Use Promise.all to execute all insert queries in parallel
    await Promise.all(
      orders.map(async ({ userId, movieId, deliveryDate, deliveryAgentId, deliveryCharge = "300" }) => {
        await db.query(
          'INSERT INTO orders (user_id, movie_id, delivery_date, delivery_agent_id, delivery_charge) VALUES ($1, $2, $3, $4, $5)',
          [userId, movieId, deliveryDate, deliveryAgentId, deliveryCharge]
        );
      })
    );    

    // Get all orders for the specified userId
    const result = await db.query('SELECT * FROM orders WHERE user_id = $1 AND pickup_date IS NULL', [orders[0].userId]);
    const allOrders = result.rows;

    res.json({ message: 'Successfully ordered!', orders: allOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Schedule a pickup
router.post('/pickups', isAuthenticated, async (req, res) => {
  try {
    const orders = req.body;

    // Use Promise.all to execute all update queries in parallel
    await Promise.all(
      orders.map(async ({ pickupDate, orderId, pickupAgentId, userId }) => {
        await db.query(
          'UPDATE orders SET pickup_date = $1, pickup_agent_id = $2 WHERE id = $3 AND pickup_date IS NULL',
          [pickupDate, pickupAgentId, orderId]
        );
      })
    );

    // Get all orders for the specified userId where pickupDate is null
    const result = await db.query('SELECT * FROM orders WHERE user_id = $1', [orders[0].userId]);
    const allOrders = result.rows;

    res.json({ message: 'Successfully updated pickups!', orders: allOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add more APIs as needed

module.exports = router;
