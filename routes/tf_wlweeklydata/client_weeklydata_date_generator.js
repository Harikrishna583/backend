
const express = require("express");
const pool = require("../../db"); // MySQL connection pool
const router = express.Router();

router.post("/", async (req, res) => {
  
  const { Cust_ID, useremail } = req.body;

  // Input validation
  if (!useremail || !Cust_ID) {
    return res.status(400).json({ error: "Email and Cust_ID are required" });
  }

  try {
    // Check if user exists
    const [checkUserExisting] = await pool.query(
      `SELECT * FROM tf_users WHERE email = ?`,
      [useremail]
    );

    if (checkUserExisting.length === 0) {
      return res.status(404).json({ message: "User email not found" });
    }

    // Fetch program data
    const [userProgram] = await pool.query(
      `SELECT programstartday, total_program_days FROM tf_userprogram WHERE Cust_ID = ?`,
      [Cust_ID]
    );

    

    if (userProgram.length === 0) {
      return res.status(404).json({ message: "No program found for user" });
    }

    const { programstartday, total_program_days } = userProgram[0];


    console.log(" programstartday, total_program_days", programstartday, total_program_days)

    // Generate list of program days
    const startDate = new Date(programstartday);
    const generatedDates = [];

    for (let i = 0; i < total_program_days; i++) {
      const newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() + i);
      generatedDates.push({
        day: i + 1,
        date: newDate.toISOString().split("T")[0], // format YYYY-MM-DD
      });
    }

    return res.status(200).json({ programDays: generatedDates });

  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
