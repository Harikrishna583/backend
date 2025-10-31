const express = require("express");
const pool = require("../db");
const router = express.Router();

// Route to fetch supplement fields
router.post("/", async (req, res) => {
  try {
    // Fetch supplement fields from the database
    const [supplementFields] = await pool.query(
      `SELECT valuePrefix,name FROM supplement_fields`
    );

    // Send the supplement fields in the response
    return res.status(200).json(supplementFields);
  } catch (error) {
    console.error("Error fetching supplements:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
