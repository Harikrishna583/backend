const express = require("express");
const pool = require("../../db"); // MySQL connection pool
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
    const [userProgram] = await pool.query(
      `SELECT number_of_snack FROM tf_userprogram WHERE Cust_ID = ?`,
      [Cust_ID]
    );

    if (userProgram.length === 0) {
      return res.status(404).json({ message: "No program found for user" });
    }

    // Dynamically retrieve the number_of_snack from the user program
    const number_of_snack = userProgram[0].number_of_snack;

    // Fetch snack options
    const [snack_options] = await pool.query(`SELECT name FROM snack_options`);

    // Build the response dynamically based on number_of_snack
    const response = [];

    for (let i = 1; i <= number_of_snack; i++) {
      response.push({
        number_of_snack: i,
        snack_options: snack_options.map((row) => row.name),
      });
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
