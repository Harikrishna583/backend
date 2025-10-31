const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const pool = require('../db'); // MySQL pool connection

const router = express.Router();
const JWT_SECRET= "your_strong_random_secret_key_12345";

// Function to get client IP (uses external service for public IP)
const getIpAddress = async (req) => {
  let ip =
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress;

  if (ip === '::1') ip = '127.0.0.1';

  if (ip === '127.0.0.1' || ip.startsWith('192.168')) {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      ip = response.data.ip;
    } catch (error) {
      console.error('Error fetching public IP:', error);
      ip = 'Unknown';
    }
  }

  return ip;
};


// Login route
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM tf_users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // 🛠️ Create JWT token
    const sessionToken = jwt.sign(
      { id: user.Cust_ID, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Optionally store session info if needed
    const ip = await getIpAddress(req);
    const device = req.headers['user-agent'];


    await pool.query(
      `INSERT INTO tf_session_token (user_id,Cust_ID, session_token, ip_address, device_info)
       VALUES (?,?, ?, ?, ?)`,
      [user.Cust_ID,user.Cust_ID, sessionToken, ip, device]
    );
//  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token: sessionToken, username: user.username, user:user });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;







