const express = require('express');
const router = express.Router();
const db = require('../../db'); // Make sure this is the promise-based client

// GET /messages (not /users as in your comment)
router.get('/', async (req, res) => {
  try {
    console.log('Request received with query:', req.query);
    const { senderId, receiverId } = req.query;
    
    if (!senderId || !receiverId) {
      console.log('Missing required parameters');
      return res.status(400).json({ 
        error: 'Both senderId and receiverId are required',
        received: req.query 
      });
    }

    console.log(`Fetching messages between ${senderId} and ${receiverId}`);
    
    const query = `
      SELECT m.*, u.first_name as sender_name 
      FROM tf_messages m
      JOIN tf_users u ON m.sender_id = u.id
      WHERE (m.sender_id = ? AND m.receiver_id = ?) 
      OR (m.sender_id = ? AND m.receiver_id = ?) 
      ORDER BY m.timestamp ASC
    `;
    
    // Since you're using mysql2/promise, use await instead of callback
    const [results] = await db.query(query, [senderId, receiverId, receiverId, senderId]);
    
    console.log(`Found ${results.length} messages`);
    // console.log('Sample message:', results.length > 0 ? results[0] : 'No messages');
    
    res.json(results);
  } catch (err) {
    console.error('Error fetching messages:', {
      message: err.message,
      stack: err.stack,
      query: req.query
    });
    res.status(500).json({ 
      error: 'Failed to fetch messages',
      details: err.message 
    });
  }
});

module.exports = router;