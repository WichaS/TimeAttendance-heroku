const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const chalk = require("chalk");
const path = require("path");
const db = require("./app/models");
const Role = db.role;

var corsOptions = {
  origin: "http://localhost:8081",
};

// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and Resync Db");
//   initial();
// });
db.sequelize.sync();

app.use(morgan("dev"));

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json({ limit: "2mb" }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to bezkoder application." });
// });
app.use(express.static(path.join(__dirname, "build")));

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/timeAttendance.routes")(app);
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

async function initial() {
  var a = await Role.create({
    id: 1,
    name: "user",
  });

  console.log("a : ", a);
  console.log("a.id : ", a.id);
  var b = await Role.create({
    id: 2,
    name: "manager",
  });

  console.log("b : ", b);
  console.log("b.id : ", b.id);

  Role.create({
    id: 3,
    name: "admin",
  });
}
