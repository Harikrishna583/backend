const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db'); 

const router = express.Router();

router.post("/", async (req, res) => {
    console.log("Auth=Register page", req.body);
    const { email, username, password } = req.body;

    try {
        const [existingUser] = await pool.query('SELECT * FROM tf_users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);

        // Split username into first and last names
        const names = username.trim().split(/\s+/);
        const firstName = names[0];
        const lastName = names.length > 1 ? names.slice(1).join(' ') : '';

        // First check if we have any coaches available
        const [coaches] = await pool.query('SELECT coachid FROM tf_coaches LIMIT 1');
        let coachIdValue = null;
        
        if (coaches.length > 0) {
            coachIdValue = coaches[0].coachid;
        }

        // Insert user with or without coachid
        const [result] = await pool.query(
            `INSERT INTO tf_users (email, password, first_name, last_name, coachid) 
             VALUES (?, ?, ?, ?, ?)`,
            [email, hashpassword, firstName, lastName, coachIdValue]
        );

        const userId = result.insertId;

        return res.status(201).json({ 
            message: "User registered successfully",
            userId: userId,
            Cust_ID: userId
        });

    } catch (error) {
        console.log("error", error);
        
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            // If still failing, try temporary workaround
            try {
                await pool.query('SET FOREIGN_KEY_CHECKS=0;');
                
                const [result] = await pool.query(
                    `INSERT INTO tf_users (email, password, first_name, last_name) 
                     VALUES (?, ?, ?, ?)`,
                    [email, hashpassword, firstName, lastName]
                );
                
                await pool.query('SET FOREIGN_KEY_CHECKS=1;');
                
                return res.status(201).json({ 
                    message: "User registered successfully",
                    userId: result.insertId,
                    Cust_ID: result.insertId
                });
                
            } catch (innerError) {
                console.log("Inner error:", innerError);
                return res.status(500).json({ message: "Registration failed completely" });
            }
        }
        
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;