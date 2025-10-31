const express = require('express');
const router = express.Router();
const poolPromise = require('../../db'); // your DB pool connection

// POST /all - Get all weight entries for a customer
router.post('/', async (req, res) => {
    const { custid } = req.body;

    if (!custid) {
        return res.status(400).json({ success: false, message: "custid is required." });
    }

    let connection;
    try {
        connection = await poolPromise.getConnection();

        const query = `
            SELECT id, tdate, Cust_ID, dayofprogram, dopdate, weight 
            FROM tf_wldialydata 
            WHERE Cust_ID = ? 
            ORDER BY dopdate DESC
        `;

        const [results] = await connection.query(query, [custid]);

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "No data found." });
        }

        // Return all data as array
        return res.status(200).json({
            success: true,
            data: results.map(row => ({
                id: row.id,
                timestamp: row.tdate,
                custId: row.Cust_ID,
                dayOfProgram: row.dayofprogram,
                date: row.dopdate,
                weight: row.weight
            }))
        });

    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error", error: err.message });
    } finally {
        if (connection) await connection.release();
    }
});

module.exports = router;
