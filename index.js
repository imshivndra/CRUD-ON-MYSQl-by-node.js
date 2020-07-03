const mysql = require("mysql");
const express = require("express");
const cors = require("cors");

const app = express();
const bodyparser = require("body-parser");

app.use(bodyparser.json());
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));

var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",

  database: "employeedb",
});
mysqlConnection.connect((error) => {
  if (!error) {
    console.log("DB connection successful");
  } else {
    console.log("connection failed " + JSON.stringify(error, undefined, 2));
  }
});

//to read all employee data
app.get("/employees", (req, res) => {
  mysqlConnection.query("SELECT * FROM employee", (error, rows, fields) => {
    if (!error) {
      res.send(rows);
    } else {
      console.log(error);
    }
  });
  //to read employee data by ID
  app.get("/employees/:id", (req, res) => {
    mysqlConnection.query(
      "SELECT * FROM employee WHERE EmpId=?",
      [req.params.id],
      (error, rows, fields) => {
        if (!error) {
          res.send(rows);
        } else {
          console.log(error);
        }
      }
    );
  });
  //for deleting employee by id

  app.delete("/employees/:id", (req, res) => {
    mysqlConnection.query(
      "DELETE FROM employee WHERE EmpId=?",
      [req.params.id],
      (error, rows, fields) => {
        res.send("deleted sucessfully.");
        if (!error) {
          res.send(rows);
        } else {
          console.log(error);
        }
      }
    );
  });

  //inserting data

  app.post("/employees", (req, res) => {
    const EmpId = req.body.EmpId;
    const EmpName = req.body.Name;
    const EmpCode = req.body.EmpCode;
    const Salary = req.body.Salary;

    mysqlConnection.query(
      "INSERT INTO employee VALUES(?,?,?,?)",
      [EmpId, EmpName, EmpCode, Salary],
      (error, rows, fields) => {
        if (!error) {
          res.send(rows);
          console.log("created successfully");
        } else {
          res.send(error);
        }
      }
    );
  });
  //Updating Data
  app.put("/employees", (req, res) => {
    let sql = "UPDATE employee SET Name= ? WHERE EmpId = ?";
    mysqlConnection.query(
      sql,
      [req.body.Name, req.body.EmpId],
      (error, rows, fields) => {
        res.send("Updated Successfully");
        if (!error) {
          res.send(rows);
        } else {
          res.send(rows);
        }
      }
    );
  });
});

app.listen(3000, () => {
  console.log("express is up on port 3000");
});
