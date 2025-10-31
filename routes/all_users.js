const express = require('express');
const router = express.Router();
const db = require('../db'); // Make sure this is the promise-based client

// GET /users
router.get('/', async (req, res) => {
  try {
    const query = 'SELECT * FROM tf_users';
    
    // For mysql2/promise client:
    const [results] = await db.query(query);
    // console.log("results",results);
    
    res.json(results);
  } catch (err) {
    console.error('Users fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;