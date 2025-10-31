const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../db'); // Use your existing DB connection



const router = express.Router();
const JWT_SECRET = "your_strong_random_secret_key_12345";

// ----------------- Helper: Generate Next Coach ID -----------------
async function getNextCoachId() {
  const [rows] = await pool.query('SELECT coach_id FROM tf_coaches ORDER BY id DESC LIMIT 1');
  if (rows.length === 0) return 'COACH001';
  const lastId = rows[0].coach_id;
  const num = parseInt(lastId.replace('COACH', '')) + 1;
  return 'COACH' + num.toString().padStart(3, '0');
}

// ----------------- Registration Route -----------------
router.post('/register', async (req, res) => {
  const { username, email, mobilenumber, password } = req.body;

  try {
    // Check if email exists
    const [existing] = await pool.query('SELECT * FROM tf_coaches WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const coach_id = await getNextCoachId();
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO tf_coaches (coach_id, username, email, mobilenumber, password) VALUES (?, ?, ?, ?, ?)',
      [coach_id, username, email, mobilenumber, hashedPassword]
    );

    return res.json({ message: 'Coach registered successfully', coach_id });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ----------------- Login Route -----------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM tf_coaches WHERE email = ?', [email]);
    if (users.length === 0) return res.status(401).json({ message: 'Invalid email' });

    const user = users[0];
    if (!user.password) return res.status(400).json({ message: 'Password not set for this user' });

    const isMatch = await bcrypt.compare(password, user.password); // ✅ use correct column
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: user.id, coach_id: user.coach_id, username: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      token,
      username: user.name,
      coach_id: user.coach_id,
      email: user.email
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ----------------- Protected Route Example -----------------
router.get('/info', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [rows] = await pool.query('SELECT id, coach_id, username, email, mobilenumber FROM tf_coaches WHERE id = ?', [decoded.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Coach not found' });

    return res.json({ coach: rows[0] });
  } catch (err) {
    console.error('Token error:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
