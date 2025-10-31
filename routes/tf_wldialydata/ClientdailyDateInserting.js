
const express = require("express");
const pool = require("../../db");
const router = express.Router();


const  validateFields = (fields, res) =>{
    for(const[key,values] of Object.entries(fields)){
        if(!values){
            res.status(400).json({errorMessage:`${key} is missing.`});
            return false;
        }

    }
    return true;
};

router.post("/", async (req, res) => {
    console.log("req=====", req.body);

    try {
        const { Cust_ID, dop, dopdate } = req.body;
        const isValid = validateFields({ Cust_ID, dop, dopdate }, res);
        if (!isValid) return;

        const [checkingRecord] = await pool.query(
            `SELECT * FROM tf_wldialydata WHERE Cust_ID = ? AND dayofprogram = ? AND dopdate = ?`,
            [Cust_ID, dop, dopdate]
        );

        if (checkingRecord.length === 0) {
            await pool.query(
                `INSERT INTO tf_wldialydata (Cust_ID, dayofprogram, dopdate) VALUES (?, ?, ?)`,
                [Cust_ID, dop, dopdate]
            );

            res.status(200).json({ message: "Date record inserted successfully" });
        } else {
            res.status(201).json({ message: "Date record already inserted" });
        }

    } catch (error) {
        console.log("Daily date inserted api error", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



module.exports = router;