const express = require('express');
const router = express.Router();
const poolPromise = require('../../db');

router.post('/', async (req, res) => {
  console.log("Incoming request body:", req.body);

  try {
    const {
      custid,
      dop,
      dopdate,
      dboperation = 'UPDATE',
      bc_weight,
      bc_bmi,
      bc_bodyfat_percentage,
      bc_fatfreeweight,
      bc_subcutaneousfat,
      bc_visceralfat_percentage,
      bc_bodywater,
      bc_skeletalmuscle,
      bc_leanmuscle,
      bc_bonemass,
      bc_protein,
      bc_bmr,
      bc_metabolicage
    } = req.body;

    // Validate required fields
    if (!custid || !dop || !dopdate) {
      return res.status(400).json({
        success: false,
        message: "custid, dop (dayofprogram), and dopdate are required."
      });
    }

    const normalizedDopDate = new Date(dopdate).toISOString().split('T')[0];
    const connection = await poolPromise.getConnection();

    try {
      const [existing] = await connection.query(
        `SELECT id FROM tf_wlweeklydata WHERE Cust_ID = ? AND dayofprogram = ? AND DATE(dopdate) = ?`,
        [custid, dop, normalizedDopDate]
      );

      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No record found to update. Please create a record first."
        });
      }

      // Always update if record exists (removed dboperation check)
      const updateQuery = `
        UPDATE tf_wlweeklydata SET
          bc_weight = ?,
          bc_bmi = ?,
          bc_bodyfat_percentage = ?,
          bc_fatfreeweight = ?,
          bc_subcutaneousfat = ?,
          bc_visceralfat_percentage = ?,
          bc_bodywater = ?,
          bc_skeletalmuscle = ?,
          bc_leanmuscle = ?,
          bc_bonemass = ?,
          bc_protein = ?,
          bc_bmr = ?,
          bc_metabolicage = ?,
          bcsaved = 1
        WHERE Cust_ID = ? AND dayofprogram = ? AND DATE(dopdate) = ?
      `;

      const updateValues = [
        bc_weight || null,
        bc_bmi || null,
        bc_bodyfat_percentage || null,
        bc_fatfreeweight || null,
        bc_subcutaneousfat || null,
        bc_visceralfat_percentage || null,
        bc_bodywater || null,
        bc_skeletalmuscle || null,
        bc_leanmuscle || null,
        bc_bonemass || null,
        bc_protein || null,
        bc_bmr || null,
        bc_metabolicage || null,
        custid,
        dop,
        normalizedDopDate
      ];

      await connection.query(updateQuery, updateValues);
      
      return res.status(200).json({
        success: true,
        message: "Body composition updated successfully."
      });

    } finally {
      connection.release();
    }

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
});

module.exports = router;