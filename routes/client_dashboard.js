const express = require("express");
const pool = require("../db"); // MySQL connection pool
const router = express.Router();

router.post("/", async (req, res) => {
  const { Cust_ID, useremail } = req.body;

  if (!useremail || !Cust_ID) {
    return res.status(400).json({ error: "Email and Cust_ID are required" });
  }

  try {
    // Check if the user exists
    const [checkUserExisting] = await pool.query(
      `SELECT * FROM tf_users WHERE email = ?`,
      [useremail]
    );

    if (checkUserExisting.length === 0) {
      return res.status(404).json({ message: "User email not found" });
    }

    // Fetch the program data for the user
    const [userStartProgram] = await pool.query(
      `SELECT programstartday FROM tf_userprogram WHERE Cust_ID = ?`,
      [Cust_ID]
    );

    if (userStartProgram.length === 0) {
      return res.status(404).json({ message: "Program data not found for user" });
    }

    return res.status(200).json({
      message: "Program start day fetched successfully",
      programstartday: userStartProgram[0].programstartday,
    });

  } catch (error) {
    console.error("Error fetching user program data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
