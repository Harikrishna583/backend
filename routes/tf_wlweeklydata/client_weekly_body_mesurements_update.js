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
        neck,
        chest,
        leftarm,
        rightarm,
        waist,
        hips,
        leftthigh,
        rightthigh,
        leftcalf,
        rightcalf
    } = req.body;

    // Validate required fields
    if (!custid || !dop || !dopdate) {
        return res.status(400).json({ 
            success: false, 
            message: "custid, dop (dayofprogram), and dopdate are required." 
        });
    }

    let connection;
    try {
        // Normalize dopdate to YYYY-MM-DD format
        const normalizedDopDate = new Date(dopdate).toISOString().split('T')[0];
        
        // Connect to database
        connection = await poolPromise.getConnection();

        // Check if a record already exists for the given custid, dayofprogram, and dopdate
        const [existing] = await connection.query(
            `SELECT id FROM tf_wlweeklydata WHERE Cust_ID = ? AND dayofprogram = ? AND DATE(dopdate) = ?`,
            [custid, dop, normalizedDopDate]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Record not found. Please create a record first."
            });
        }

        // Update existing record
        const updateQuery = `
            UPDATE tf_wlweeklydata SET
                neck = ?,
                chest = ?,
                leftarm = ?,
                rightarm = ?,
                waist = ?,
                hips = ?,
                leftthigh = ?,
                rightthigh = ?,
                leftcalf = ?,
                rightcalf = ?,
                bmsaved = 1
            WHERE Cust_ID = ? AND dayofprogram = ? AND DATE(dopdate) = ?
        `;

        const updateValues = [
            neck || null,
            chest || null,
            leftarm || null,
            rightarm || null,
            waist || null,
            hips || null,
            leftthigh || null,
            rightthigh || null,
            leftcalf || null,
            rightcalf || null,
            custid, 
            dop, 
            normalizedDopDate
        ];

        await connection.query(updateQuery, updateValues);
        return res.status(200).json({ 
            success: true, 
            message: "Body measurements updated successfully." 
        });

    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ 
            success: false, 
            message: "Database error", 
            error: err.message 
        });
    } finally {
        if (connection) await connection.release();
    }
});

module.exports = router;