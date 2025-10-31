const express = require('express');
const router = express.Router();
const poolPromise = require('../../db');

router.post('/', async (req, res) => {
    console.log("req.body", req.body);

    // Destructure the incoming request body
    const {
        custid,
        dop, // dayofprogram
        dopdate,
        weight,
        steps,
        waterintake,
        supplements = [], // Array of supplement keys
        dboperation = 'UPDATE' // Default to UPDATE
    } = req.body;

    // Validate required fields
    if (!custid || !dop || !dopdate) {
        return res.status(400).json({ success: false, message: "custid, dop (dayofprogram), and dopdate are required." });
    }

    try {
        // Normalize dopdate to YYYY-MM-DD format
        const normalizedDopDate = new Date(dopdate).toISOString().split('T')[0];
        
        // Initialize all supplement values to 0
        const supplementValues = {
            p_m: 0, p_a: 0, p_e: 0,
            mv_m: 0, mv_a: 0, mv_e: 0,
            omega3_m: 0, omega3_a: 0, omega3_e: 0,
            cal_m: 0, cal_a: 0, cal_e: 0,
            vb_m: 0, vb_a: 0, vb_e: 0,
            vc_m: 0, vc_a: 0, vc_e: 0,
            fiber_m: 0, fiber_a: 0, fiber_e: 0,
            triphala_m: 0, triphala_a: 0, triphala_e: 0,
            others1name: '', o1_m: 0, o1_a: 0, o1_e: 0,
            others2name: '', o2_m: 0, o2_a: 0, o2_e: 0,
            others3name: '', o3_m: 0, o3_a: 0, o3_e: 0
        };

        // Update supplement values based on the received array
        supplements.forEach(supp => {
            if (supplementValues.hasOwnProperty(supp)) {
                supplementValues[supp] = 1;
            }
        });

        // Connect to database
        const connection = await poolPromise.getConnection();

        // Check if a record already exists for the given custid, dayofprogram, and dopdate
        const [existing] = await connection.query(
            `SELECT id FROM tf_wldialydata WHERE Cust_ID = ? AND dayofprogram = ? AND DATE(dopdate) = ?`,
            [custid, dop, normalizedDopDate]
        );

        if (existing.length > 0 && dboperation.toUpperCase() === 'UPDATE') {
            // If record exists and operation is UPDATE, update it
            const updateQuery = `
                UPDATE tf_wldialydata SET
                    weight = ?, steps = ?, waterintake = ?,
                    p_m = ?, p_a = ?, p_e = ?,
                    mv_m = ?, mv_a = ?, mv_e = ?,
                    omega3_m = ?, omega3_a = ?, omega3_e = ?,
                    cal_m = ?, cal_a = ?, cal_e = ?,
                    vb_m = ?, vb_a = ?, vb_e = ?,
                    vc_m = ?, vc_a = ?, vc_e = ?,
                    fiber_m = ?, fiber_a = ?, fiber_e = ?,
                    triphala_m = ?, triphala_a = ?, triphala_e = ?,
                    others1name = ?, o1_m = ?, o1_a = ?, o1_e = ?,
                    others2name = ?, o2_m = ?, o2_a = ?, o2_e = ?,
                    others3name = ?, o3_m = ?, o3_a = ?, o3_e = ?,
                    hdatasaved = 1
                WHERE Cust_ID = ? AND dayofprogram = ? AND DATE(dopdate) = ?
            `;

            const updateValues = [
                weight || null, steps || null, waterintake || null,
                supplementValues.p_m, supplementValues.p_a, supplementValues.p_e,
                supplementValues.mv_m, supplementValues.mv_a, supplementValues.mv_e,
                supplementValues.omega3_m, supplementValues.omega3_a, supplementValues.omega3_e,
                supplementValues.cal_m, supplementValues.cal_a, supplementValues.cal_e,
                supplementValues.vb_m, supplementValues.vb_a, supplementValues.vb_e,
                supplementValues.vc_m, supplementValues.vc_a, supplementValues.vc_e,
                supplementValues.fiber_m, supplementValues.fiber_a, supplementValues.fiber_e,
                supplementValues.triphala_m, supplementValues.triphala_a, supplementValues.triphala_e,
                supplementValues.others1name, supplementValues.o1_m, supplementValues.o1_a, supplementValues.o1_e,
                supplementValues.others2name, supplementValues.o2_m, supplementValues.o2_a, supplementValues.o2_e,
                supplementValues.others3name, supplementValues.o3_m, supplementValues.o3_a, supplementValues.o3_e,
                custid, dop, normalizedDopDate
            ];

            await connection.query(updateQuery, updateValues);
            return res.status(200).json({ success: true, message: "Health data updated." });
        } 
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error", error: err.message });
    } finally {
        // if (connection) await connection.release();
    }
});

module.exports = router;