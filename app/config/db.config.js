module.exports = {
  HOST: "",
  USER: "",
  PASSWORD: "",
  DB: "",
  dialect: "mysql",
  port: "3306",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

// module.exports = {
//   HOST: "localhost",
//   USER: "root",
//   PASSWORD: "Wicha2540",
//   DB: "time_attendance_db",
//   dialect: "mysql",
//   port: "3306",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
// };
