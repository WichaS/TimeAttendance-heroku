const { authJwt } = require("../middleware");
const controller = require("../controllers/time_attendance.controller");

module.exports = function (app) {
  // Create a new Tutorial
  app.post("/api/timeAttendance", [authJwt.verifyToken], controller.create);

  //Retrieve timeAttendanceToday
  app.post(
    "/api/gettimeAttendance",
    [authJwt.verifyToken],
    controller.findAllCur
  );

  //Retrieve timeAttendance Histrory
  app.post(
    "/api/gettimeAttendanceHistory",
    [authJwt.verifyToken],
    controller.findHistrory
  );

  // Dev
  // Create a new Tutorial
  app.post("/api/dev/create_DummytimeAttendance", controller.createDummy);
};
