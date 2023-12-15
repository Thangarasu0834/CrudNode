// app.js
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 4000; // or any port you prefer
const db = require("./DataBase"); // Import the database connection
const cors = require("cors");
app.use(bodyParser.json());
app.use(cors());
// Your CRUD routes go here

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

app.get("/api", (req, res) => {
  res.status(200).send("API Connected");
});

app.post("/api/addnewuser", (req, res) => {
  const { first_name, last_name, city } = req.body;
  console.log("req.body", req.body);
  db.query(
    "INSERT INTO user_table (first_name, last_name, city) VALUES (?, ?, ?)",
    [first_name, last_name, city],
    (err, result) => {
      console.log("result", result);
      if (err) {
        console.error(err);
        res.status(404).send({
          status: false,
          message: "Error adding user to the database",
        });
      } else {
        res.status(200).send({
          status: true,
          message: "User Added Success",
        });
      }
    }
  );
});

app.get("/api/users", (req, res) => {
  // Query to select all users from the 'user_table'
  const sql = "SELECT * FROM user_table";
  // Execute the query
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(404).send("Internal Server Error");
    } else {
      console.log("results", results);
      res.status(200).send({
        status: true,
        message: "User list get Success",
        data: results,
      });
    }
  });
});

// Update user by ID
app.put("/api/users/update", (req, res) => {
  const { id, first_name, last_name, city } = req.body;
  console.log("req.body", req.body);

  const sql =
    "UPDATE user_table SET first_name=?, last_name=?, city=? WHERE id=?";

  db.query(sql, [first_name, last_name, city, id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json({
        status: true,
        message: `User with ID ${id} updated successfully`,
        data: result,
      });
    }
  });
});


// Delete user by ID
app.delete('/api/users/delete', (req, res) => {
  const userId = req.body.id; // Extract ID from the request body

  if (!userId) {
    return res.status(400).json({
      status: false,
      message: 'ID is required in the request body for DELETE operation',
    });
  }

  const sql = 'DELETE FROM user_table WHERE id=?';

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).json({
        status: true,
        message: `User with ID ${userId} deleted successfully`,
        data: result,
      });
    }
  });
});