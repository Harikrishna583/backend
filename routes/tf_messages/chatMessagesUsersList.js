

const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/', async (req, res) => {
        console.log("req.body",req.query)

    try {
        const { senderId } = req.query;
        console.log( senderId);

        
     

        const query = `
            SELECT 
                u.Cust_ID,
                CONCAT(u.first_name, ' ', u.last_name) AS name,
                u.email,
                f.status,
                f.created_at,
                f.updated_at
            FROM friend_list f
            JOIN tf_users u 
                ON (u.Cust_ID = f.friend_id AND f.user_id = ?)
                OR (u.Cust_ID = f.user_id AND f.friend_id = ?)
            WHERE f.status = 'accepted'
            ORDER BY f.created_at DESC
        `;

        const [results] = await db.query(query, [senderId, senderId]);



        
        console.log("results :", results);
        res.json(results);
        
    } catch (err) {
        console.error('Error fetching friends list:', err);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

module.exports = router;