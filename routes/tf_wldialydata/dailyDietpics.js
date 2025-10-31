const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("../../db");

const router = express.Router();

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

// Validate fields
const validateFields = (fields, res) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      res.status(400).json({ errorMessage: `${key} is missing.` });
      return false;
    }
  }
  return true;
};

// Mapping for image types
const validImgTypes = {
  breakFast: "breakfast_pic",
  lunch: "lunch_pic",
  dinner: "dinner_pic",
};

// Route to handle upload
router.post("/", upload.single("formFileLg"), async (req, res) => {
  const file = req.file;
  const { custId, imgType, dop, dopdate } = req.body;

  console.log("Upload diet pic req.body", req.body);

  if (!file) return res.status(400).json({ errorMessage: "File is missing." });

  const isValid = validateFields({ custId, imgType, dop, dopdate }, res);
  if (!isValid) return;

  const columnName = validImgTypes[imgType];

  if (!columnName) {
    return res.status(400).json({ errorMessage: "Invalid imgType." });
  }

  const imagePath = `/uploads/${file.filename}`;

  try {
    const [existing] = await pool.query(
      `SELECT id FROM tf_wldialydata WHERE Cust_ID = ? AND dayofprogram = ? AND DATE(dopdate) = ?`,
      [custId, dop, dopdate]
    );

    if (existing.length > 0) {
      // Update image field
      await pool.query(
        `UPDATE tf_wldialydata SET ${columnName} = ? WHERE Cust_ID = ? AND dayofprogram = ? AND DATE(dopdate) = ?`,
        [imagePath, custId, dop, dopdate]
      );
      return res.status(200).json({ message: "Image updated successfully." });
    } else {
      // Insert new record with image
      const insertData = {
        Cust_ID: custId,
        dayofprogram: dop,
        dopdate: dopdate,
        [columnName]: imagePath,
        hdatasaved: 0,
        snackssaved: 0,
      };

      const fields = Object.keys(insertData).join(", ");
      const values = Object.values(insertData);
      const placeholders = values.map(() => "?").join(", ");

      await pool.query(
        `INSERT INTO tf_wldialydata (${fields}) VALUES (${placeholders})`,
        values
      );

      return res.status(200).json({ message: "Image uploaded successfully." });
    }
  } catch (err) {
    console.error("Error handling image upload:", err);
    return res.status(500).json({ errorMessage: "Internal server error." });
  }
});

module.exports = router;
