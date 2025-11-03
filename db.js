const mysql = require('mysql2/promise');
require('dotenv').config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
// });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  timezone: '+05:30',
  dateStrings: true,
  charset: 'utf8mb4'
});


// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "fitness_platform",
//   waitForConnections: true,
//   connectionLimit: 10,
//   timezone: '+05:30', // Set to IST
//   dateStrings: true, // Return dates as strings
//   charset: 'utf8mb4'
// });



pool.getConnection()
  .then((connection )=>{
        console.log("DB connection successfully connecting.......");
         connection.release();
      })
  .catch((error)=>{
      console.log("DB connection error",error);
      console.log("DB connection failed checked once.....");
  })
module.exports = pool;
