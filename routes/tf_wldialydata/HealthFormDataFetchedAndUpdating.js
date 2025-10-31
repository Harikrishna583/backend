const express = require("express");
const pool = require("../../db");
const router = express.Router();

router.post("/", async (req, res) => {
    console.log("Request received for HealthFormDataFetched");
    
    try {
        const { Cust_ID, dop, dopdate } = req.body;
        
        if (!Cust_ID) {
            return res.status(400).json({
                success: false,
                message: "Customer ID is required",
                data: null
            });
        }

        // Check if user exists
        const checkUserExisting = await pool.query(
            `SELECT * FROM tf_users WHERE Cust_ID = ?`,
            [Cust_ID]
        );

        console.log("User check result:", checkUserExisting);

        // Check if any rows were returned
        if (checkUserExisting && checkUserExisting.length > 0) {
            const [HealthFormDataFetched] = await pool.query(
                `SELECT id, tdate, Cust_ID, dayofprogram, dopdate, weight, steps, waterintake, 
                        p_m, p_a, p_e, mv_m, mv_a, mv_e, omega3_m, omega3_a, omega3_e,
                        cal_m, cal_a, cal_e, vb_m, vb_a, vb_e, vc_m, vc_a, vc_e,
                        fiber_m, fiber_a, fiber_e, triphala_m, triphala_a, triphala_e,
                        others1name, o1_m, o1_a, o1_e, others2name, o2_m, o2_a, o2_e,
                        others3name, o3_m, o3_a, o3_e, snack1, snack2, snack3, snack4, snack5,
                        snack6, snack7, snack8, snack9, snack10, hdatasaved, snackssaved,breakfast_pic,lunch_pic,dinner_pic
                FROM tf_wldialydata WHERE Cust_ID = ? AND dayofprogram = ? AND dopdate = ?`,
                [Cust_ID, dop, dopdate] // Use all three parameters
            );

            console.log("Health data fetched:", HealthFormDataFetched);

            res.status(200).json({
                success: true,
                data: HealthFormDataFetched,
                message: "Data fetched successfully"
            });

        } else {
            res.status(404).json({
                success: false,
                message: "User Not Found",
                data: null
            });
        }

    } catch (error) {
        console.log("HealthFormDataFetched-page error:", error.message);
        
        res.status(500).json({
            success: false,
            message: "Server error: " + error.message,
            data: null
        });
    }
});

module.exports = router;