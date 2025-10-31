const express = require("express");
const router = express.Router();
const pool = require("../../db");

// Utility function to validate required fields
const validateFields = (fields, res) => {
    console.log("fields,",fields)
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      res.status(400).json({ errorMessage: `${key} is missing.` });
      return false;
    }
  }
  return true;
};

router.post("/", async (req, res) => {
  const {
    Cust_ID,
    dop,
    dopdate,
    snack1,
    snack2,
    snack3,
    snack4,
    snack5,
    snack6,
    snack7,
    snack8,
    snack9,
    snack10,
  } = req.body;

  // Validate required fields
  const isValid = validateFields({ Cust_ID, dop, dopdate }, res);
  if (!isValid) return;

  try {
    // Check if record already exists
    const [existingRows] = await pool.query(
      `SELECT Cust_ID FROM tf_wldialydata 
       WHERE Cust_ID = ? AND dayofprogram = ? AND DATE(dopdate) = ?`,
      [Cust_ID, dop, dopdate]
    );

    const snackValues = [
      snack1,
      snack2,
      snack3,
      snack4,
      snack5,
      snack6,
      snack7,
      snack8,
      snack9,
      snack10,
    ];

    if (existingRows.length > 0) {
      // Update existing record
      await pool.query(
        `UPDATE tf_wldialydata 
         SET snack1 = ?, snack2 = ?, snack3 = ?, snack4 = ?,
             snack5 = ?, snack6 = ?, snack7 = ?, snack8 = ?,
             snack9 = ?, snack10 = ?
         WHERE Cust_ID = ? AND dayofprogram = ? AND DATE(dopdate) = ?`,
        [...snackValues, Cust_ID, dop, dopdate]
      );
      return res.status(200).json({ message: "Snacks data updated." });
    } 
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ errorMessage: "Internal server error." });
  }
});

module.exports = router;
