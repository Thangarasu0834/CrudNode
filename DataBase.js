// db.js
const mysql = require("mysql");

var pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "testing@123",
  database: "userdata",
  port: 5000,
  connectionTimeout: 30000,
  connectionLimit:10
});

pool.getConnection((error, connection) => {
  if (error) {
    console.error("Error getting MySQL connection:", error);
  } else {
    connection.query("SELECT * FROM user_table", (err, results) => {
      connection.release();
    });
    console.log("Connected to MySQL server", Date.now());
  }
});
const sendKeepAliveQuery = () => {
  pool.getConnection((error, connection) => {
    if (error) {
      console.error("Error getting MySQL connection:", error);
    } else {
      connection.query("SELECT * from user_table", (err, result) => {
        if (err) {
          console.error("Error executing keep-alive query:", err);
        } else {
          console.log("Keep-alive query executed");
        }
        connection.release();
      });
    }
  });
};
setInterval(sendKeepAliveQuery, 1 * 60 * 1000);
module.exports = pool;
