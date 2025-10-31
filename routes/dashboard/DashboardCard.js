const express = require("express");
const pool = require("../../db");
const router = express.Router();

const validateFields = (fields, res) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      res.status(400).json({ errorMessage: `${key} is missing.` });
      return false;
    }
  }
  return true;
};

router.post("/", async (req, res) => {
  console.log("req=====", req.body);

  try {
    const { Cust_ID } = req.body;
    const isValid = validateFields({ Cust_ID }, res);
    if (!isValid) return;

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Query to get today's data
    const [todayData] = await pool.query(
      `SELECT 
          steps AS todaySteps,
          waterintake AS todayWaterIntake,
          weight AS todayWeight,
          dopdate
       FROM tf_wldialydata
       WHERE Cust_ID = ? AND dopdate = ?
       ORDER BY tdate DESC
       LIMIT 1`,
      [Cust_ID, today]
    );

    // Query to get total statistics
    const [totals] = await pool.query(
      `SELECT 
          COUNT(*) AS totalActiveDays,
          COALESCE(SUM(steps), 0) AS totalSteps,
          COALESCE(SUM(waterintake), 0) AS totalWaterIntake,
          COALESCE(AVG(steps), 0) AS avgSteps,
          COALESCE(AVG(waterintake), 0) AS avgWaterIntake
       FROM tf_wldialydata
       WHERE Cust_ID = ?`,
      [Cust_ID]
    );

    // SELECT COUNT(*) as totalActiveDays
    //          FROM tf_wldialydata 
    //          WHERE Cust_ID = ?

    // Prepare result object
    let result = {
      // Today's data
      today: {
        steps: 0,
        waterIntake: 0,
        weight: null,
        date: today,
        hasData: false
      },
      // Total statistics
      totals: {
        activeDays: totals[0].totalActiveDays || 0,
        totalSteps: totals[0].totalSteps || 0,
        totalWaterIntake: totals[0].totalWaterIntake || 0,
        avgSteps: Math.round(totals[0].avgSteps || 0),
        avgWaterIntake: Math.round(totals[0].avgWaterIntake || 0)
      }
    };

    // Add today's data if available
    if (todayData.length > 0) {
      result.today = {
        steps: todayData[0].todaySteps || 0,
        waterIntake: todayData[0].todayWaterIntake || 0,
        weight: todayData[0].todayWeight || null,
        date: todayData[0].dopdate || today,
        hasData: true
      };
    }

    console.log(`Dashboard stats for Cust_ID ${Cust_ID}:`, result);
    res.status(200).json(result);

  } catch (error) {
    console.log("Dashboard stats API error", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;