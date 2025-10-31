const express = require('express');
const router = express.Router();
const poolPromise = require('../../db');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('formFileSm'), async (req, res) => {
    console.log("Incoming request body:", req.body);
    console.log("Uploaded file:", req.file);

    // Get fields from form data
    const custid = req.body.custId;
    const dop = req.body.dop;
    const dopdate = req.body.dopdate;
    const imgType = req.body.imgType;
    
    // The uploaded file path
    const filePath = req.file ? req.file.path : null;

    // Validate required fields
    if (!custid || !dop || !dopdate || !imgType || !filePath) {
        return res.status(400).json({
            success: false,
            message: "All fields including the file are required."
        });
    }

    let connection;
    try {
        // Normalize dopdate to YYYY-MM-DD
        const normalizedDopDate = new Date(dopdate).toISOString().split('T')[0];

        // Connect to database
        connection = await poolPromise.getConnection();

        // Determine which image field to update based on imgType
        let imageField;
        switch(imgType) {
            case 'side': imageField = 'body_pic1'; break;
            case 'sideangle': imageField = 'body_pic2'; break;
            case 'front': imageField = 'body_pic3'; break;
            case 'back': imageField = 'body_pic4'; break;
            default: 
                return res.status(400).json({
                    success: false,
                    message: "Invalid image type"
                });
        }

        // Check if record exists
        const [existing] = await connection.query(
            `SELECT id FROM tf_wlweeklydata WHERE Cust_ID = ? AND dayofprogram = ? AND DATE(dopdate) = ?`,
            [custid, dop, normalizedDopDate]
        );

        if (existing.length > 0) {
            // Update only the specific body_pic field
            const updateQuery = `
                UPDATE tf_wlweeklydata SET
                    ${imageField} = ?
                WHERE Cust_ID = ? AND dayofprogram = ? AND DATE(dopdate) = ?
            `;
            
            await connection.query(updateQuery, [
                filePath, // Store the file path in database
                custid,
                dop,
                normalizedDopDate
            ]);

            return res.status(200).json({
                success: true,
                message: "Body picture updated successfully.",
                imagePath: filePath
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Record not found to update."
            });
        }
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