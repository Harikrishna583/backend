const express = require('express');
const router = express.Router();

// You need to pass `pool` from server.js to here, so we'll export a function

module.exports = (pool) => {
  // LOGOUT
  router.post("/logout", async (req, res) => {
    const sessionToken = req.cookies.session;
    if (!sessionToken) return res.status(400).json({ success: false, message: "No session token provided" });

    await pool.query("DELETE FROM session_token WHERE session_token = ?", [sessionToken]);
    res.clearCookie("session");
    res.json({ success: true });
  });

  // LOGOUT ALL
  router.post("/logout-all", async (req, res) => {
    const sessionToken = req.cookies.session;
    if (!sessionToken) return res.status(400).json({ success: false, message: "No session token provided" });

    const [[userRow]] = await pool.query("SELECT user_id FROM session_token WHERE session_token = ?", [sessionToken]);
    if (userRow) {
      await pool.query("DELETE FROM session_token WHERE user_id = ?", [userRow.user_id]);
    }
    res.clearCookie("session");
    res.json({ success: true });
  });

  // LOGOUT SINGLE
  router.post("/logout-single", async (req, res) => {
    const { session_token } = req.body;
    const currentToken = req.cookies.session;

    if (!session_token || !currentToken) return res.status(400).json({ success: false });

    const [[owner]] = await pool.query("SELECT user_id FROM session_token WHERE session_token = ?", [currentToken]);
    const [[target]] = await pool.query("SELECT user_id FROM session_token WHERE session_token = ?", [session_token]);

    if (owner?.user_id !== target?.user_id) return res.status(403).json({ success: false });

    await pool.query("DELETE FROM session_token WHERE session_token = ?", [session_token]);
    res.json({ success: true });
  });

  return router;
};
