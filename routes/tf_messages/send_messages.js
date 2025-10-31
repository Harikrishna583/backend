const express = require('express');
const router = express.Router();
const db = require('../../db');
const path = require('path'); // Import the path module

// Middleware to check if user is authenticated (use your JWT verification logic here)
const authMiddleware = require('../authMiddleware'); // Assume you've implemented this

// Use the authMiddleware to populate req.user with the logged-in user's info
router.use(authMiddleware);

router.post('/', async (req, res) => {
    console.log("req.body:::",req.body)
    const { receiverId, message, file } = req.body;
    
    if (!receiverId) {
        return res.status(400).json({ error: 'receiverId is required' });
    }

    const query = `
        INSERT INTO tf_messages (sender_id, receiver_id, message, file_path, file_type) 
        VALUES (?, ?, ?, ?, ?)
    `;
    
    const filePath = file?.path || null;
    const fileType = file?.type || (filePath ? path.extname(filePath).substring(1) : 'text');

    // Save message to the database
    db.query(query, [
        req.user.id, // Use req.user.id from the middleware
        receiverId,
        message || null,
        filePath,
        fileType
    ], (err, result) => {
        if (err) {
            console.error('Message save error:', err);
            return res.status(500).json({ error: 'Failed to save message' });
        }

        // Get the full message with sender info
        const getQuery = `
            SELECT m.*, u.username as sender_name 
            FROM tf_messages m
            JOIN tf_users u ON m.sender_id = u.id
            WHERE m.id = ?
        `;
        
        db.query(getQuery, [result.insertId], (err, results) => {
            if (err || results.length === 0) {
                console.error('Message fetch error:', err);
                return res.status(500).json({ error: 'Failed to fetch saved message' });
            }
            
            const savedMessage = results[0];

            // Assuming you are using Socket.IO for real-time communication
            io.to(`user_${receiverId}`).emit('newMessage', savedMessage);

            res.status(201).json(savedMessage);
        });
    });
});

module.exports = router;
