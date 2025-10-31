// const express  = require("express");
// const pool = require("../db");
// const router = express.Router();

// router.post("/",async(req,res)=>{

//     // const {Cust_id,useremail} = req.body;
//     // const {Cust_id,useremail} = req.body;

//     const Cust_ID = 2;
//     const useremail = "priya.mehta@example.com"
//     if(!useremail){
//         return "Email is required";
//     }
//     if(!Cust_id){
//         return "Cust_id is required"
//     }


//     try{
//         const [checkUserExisting] = await pool.query(`SELECT "tf_usres" FROM WHERE email = ?`,[useremail])

//         if(checkUserExisting.length === 0){
//             return res.status(400).json({message:"user not email not found"})
//         }

//         const [healthProfileTableData] = await pool.query(`SELECT "tf_userhealthprofile" FROM WHERE Cust_ID = ?`,[Cust_ID]);

//         console.log("healthProfileTableData",healthProfileTableData);
//         return  res.status(200).json({healthProfileTableData:healthProfileTableData})
        

//     }catch(error){
//         console.log("error",error);
//         return res.status(500).json({error:"Internal Server Error"});
        

//     }

    

// });


// module.exports = router;


const express = require("express");
const pool = require("../db"); // Assuming this is your MySQL connection pool
const router = express.Router();
const db = require('../db');

router.post("/", async (req, res) => {
  // Read values from request body
  const { Cust_ID, useremail } = req.body;

  // Validate input
  if (!useremail) {
    return res.status(400).json({ error: "Email is required" });
  }
  if (!Cust_ID) {
    return res.status(400).json({ error: "Cust_ID is required" });
  }

  try {
    // Check if user exists
    const [checkUserExisting] = await pool.query(
      `SELECT * FROM tf_users WHERE email = ?`,
      [useremail]
    );

    if (checkUserExisting.length === 0) {
      return res.status(404).json({ message: "User email not found" });
    }

    // Fetch health profile data
    const [healthProfileTableData] = await pool.query(
      `SELECT * FROM tf_leads WHERE Cust_ID = ?`,
      [Cust_ID]
    );


    const [healthProfileCardData] = await pool.query(
        `SELECT * FROM tf_userhealthprofile WHERE Cust_ID = ?`,
        [Cust_ID]
      );


    // console.log("healthProfileTableData", healthProfileTableData);

    return res.status(200).json({ healthProfileTableData,healthProfileCardData });

  } catch (error) {
    console.error("Database error", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
