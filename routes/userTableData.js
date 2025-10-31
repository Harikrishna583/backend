const express = require("express");
const pool = require("../db");

const router = express.Router();

// router.post("/", async (req, res) => {
//     try {
//         const useremail = req.body.email;
//         const user_id = req.body.user_id;
//         console.log("useremail", useremail);

//         // Await the query
//         const [checkUserExisting] = await pool.query(
//             `SELECT * FROM users WHERE email = ?`,
//             [useremail]
//         );
//         // console.log("checkUserExisting", checkUserExisting);

//         // If no user found, respond early
//         if (checkUserExisting.length === 0) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const [userTableData] = await pool.query(`SELECT * FROM session_token where user_id = ?`, [user_id]);
//         return res.status(200).json({ userTableApiData : userTableData });

//     } catch (error) {
//         console.error("Error in POST / route:", error);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// module.exports = router;


router.post("/", async (req, res) => {
    try {
        const useremail = req.body.email;
        const user_id = req.body.user_id;
        console.log("useremail", useremail);

        // Check if user exists
        const [checkUserExisting] = await pool.query(
            `SELECT * FROM tf_users WHERE email = ?`,
            [useremail]
        );

        if (checkUserExisting.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Join session_token with users to fetch username too
        const [userTableData] = await pool.query(`
           SELECT tf_session_token.*, tf_users.email
FROM tf_session_token
JOIN tf_users ON tf_session_token.user_id = tf_users.Cust_ID
WHERE tf_session_token.user_id = ?`,
            [user_id]
        );

        // console.log("userTableApiData :", userTableData);
        return res.status(200).json({ userTableApiData: userTableData });


    } catch (error) {
        console.error("Error in POST / route:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;