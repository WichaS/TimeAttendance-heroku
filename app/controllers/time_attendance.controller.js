const db = require("../models");
const User = db.user;
const TimeAtten = db.time_attendance;

const config = require("../config/db.config.js");
const chalk = require("chalk");
var moment = require("moment");

const { Op, QueryTypes } = require("sequelize");

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

// create time stamp
exports.create = (req, res) => {
  let curr = moment().add(7, "h").format();
  curr = moment.tz(curr, "Asia/Bangkok");
  console.log(chalk.red(curr));
  // dev add dummy -------------------------------------------------------------
  // curr = moment().add(7, "h").subtract(1, "days").format();
  // curr = moment().add(1, "days").format();
  // User.id = 3;
  // ===========================================================================
  User.id = req.userId;
  const timeAttendance = {
    location: req.body.location ? req.body.location : "RS Tower",
    check_in: curr,
  };

  console.log(chalk.blue.bold(timeAttendance));

  TimeAtten.create(timeAttendance)
    .then(async (data) => {
      await data.setUser(User.id);
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

// Retrieve all TimeAttendance Today from the database.
exports.findAllCur = (req, res) => {
  // feature select date (find by date)
  const date = req.query.date ? req.query.date : new Date();

  User.id = req.userId;

  let a = moment().startOf("day");
  let b = moment().add(1, "days").startOf("day");

  a = moment(a).add(7, "h").format("YYYY-MM-DDTHH:mm:ss");
  b = moment(b).add(7, "h").format("YYYY-MM-DDTHH:mm:ss");

  var condition = {
    check_in: {
      [Op.and]: [{ [Op.gte]: a }, { [Op.lt]: b }],
    },
    userId: {
      [Op.eq]: User.id,
    },
  };

  TimeAtten.findAll({ where: condition, order: [["check_in", "ASC"]] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

// Retrieve all TimeAttendance Today from the database.
exports.findHistrory = async (req, res) => {
  var historyData = new Array();

  let checkInData;
  let checkOutData;

  //----------- DEV -----------
  // let userId = req.body.userId ? req.body.userId : 1;
  //-----------  ------------

  //----------- production -----------
  let userId = req.userId ? req.userId : 1;

  async function getData_CheckIn_CheckOut(userId) {
    let q_checkIn =
      `SELECT * FROM ${config.DB}.time_attendances` +
      ` WHERE check_in IN ( SELECT MIN(check_in) FROM ${config.DB}.time_attendances` +
      ` WHERE userId=${userId} AND DATE(check_in) < DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY) AND DATE(check_in) >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY)` +
      ` GROUP BY DATE(check_in) ) AND userId=${userId} order by check_in desc;`;
    let q_checkOut =
      `SELECT * FROM ${config.DB}.time_attendances` +
      ` WHERE check_in IN ( SELECT MAX(check_in) FROM ${config.DB}.time_attendances` +
      ` WHERE userId=${userId} AND DATE(check_in) < DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY) AND DATE(check_in) >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY)` +
      ` GROUP BY DATE(check_in) ) AND ${userId} order by check_in desc;`;
    // q_checkIn = "SELECT * FROM time_attendance_db.time_attendances;";
    // q_checkOut = "SELECT * FROM time_attendance_db.time_attendances;";
    // get the client
    // const mysql = require("mysql2/promise");
    // create the connection
    try {
      const CheckInData = await db.sequelize.query(q_checkIn, {
        type: QueryTypes.SELECT,
      });
      const CheckOutData = await db.sequelize.query(q_checkOut, {
        type: QueryTypes.SELECT,
      });
      return [CheckInData, CheckOutData];
    } catch (error) {
      console.log(chalk.red.inverse("error"), error);
    }

    // const connection2 = await mysql.createConnection({
    //   host: config.HOST,
    //   user: config.USER,
    //   password: config.PASSWORD,
    //   database: config.DB,
    // });
    // query database
    // const [CheckInData, fields1] = await connection2.execute(q_checkIn);
    // const [CheckOutData, fields2] = await connection2.execute(q_checkOut);

    // console.log("CheckInData======", CheckInData);
    // console.log("======", CheckOutData);
    return [CheckInData, CheckOutData];
  }

  //----------- ---------- -----------
  try {
    [checkInData, checkOutData] = await getData_CheckIn_CheckOut(userId);

    // console.log(checkInData);
    let pack = {
      date: "",
      location: "-",
      timeIn: "-",
      timeOut: "-",
      status: "-",
    };
    let DayPack = new Array();
    let timeIn = "";
    let timeOut = "";
    let status = "ontime";
    let Today = moment().format("HH:mm");
    // console.log(chalk.cyanBright(Today));

    for (i = 0; i < 7; i++) {
      pack = {
        date: "",
        location: "-",
        timeIn: "-",
        timeOut: "-",
        status: "-",
      };
      pack.date = moment().subtract(i, "days").format("MMM-DD-YYYY");

      DayPack.push(pack.date);
      historyData.push(pack);
    }
    console.log("======checkInData======");
    console.log(checkInData);
    var Worked = (e) => {
      return e == moment(item.check_in).utc().format("MMM-DD-YYYY");
    };
    console.log("historydata[4].timeIn", historyData[4].timeIn);
    let index_data_query = 0;
    for (var item of checkInData) {
      status = "On Time";
      let pack2 = { location: "", timeIn: "", timeOut: "", status: "" };
      let index = DayPack.findIndex(Worked);
      if (item) {
        console.log(chalk.blue.inverse(item.check_in));
        timeIn = moment(item.check_in).utc().format("HH:mm");
        timeOut = moment(checkOutData[index_data_query].check_in).format(
          "HH:mm"
        );

        // dev =====================================================
        // pack.timeIn = moment(checkInData[i].check_in).format(
        //   "DD-MMM-YYYY, HH:mm"
        // );
        // pack.timeOut = moment(checkOutData[i].check_in).format(
        //   "DD-MMM-YYYY, HH:mm"
        // );
        //===========================================================

        // production =====================================================
        console.log(chalk.green.inverse(timeIn));
        historyData[index].timeIn = timeIn;
        historyData[index].timeOut = timeOut;
        //================================================================
        if (
          moment(item.check_in).utc().format("MMM-DD-YYYY") ==
          moment().format("MMM-DD-YYYY")
        ) {
          status = "-";
          historyData[index].timeOut = "-";
        } else if (timeIn > "08:00" || timeOut < "18.00") {
          status = "Late";
        }
        if (timeIn == timeOut) {
          historyData[index].timeOut = "-";
          console.log(chalk.bgRed("timeIn == timeOut"));
        }

        historyData[index].location = item.location;
        historyData[index].status = status;

        // console.log(timeIn, timeOut);
        // console.log(status);
      } else {
        historyData[index].status = "-";
      }

      // console.log(DayPack.findIndex(Worked));
      historyData[index].location = item.location;
      index_data_query++;
    }
    // for (i = 0; i < 7; i++) {
    //   let d = moment().format("DD-MMM-YYYY, HH:mm");
    //   pack = { location: "", timeIn: "", timeOut: "", status: "" };
    //   status = "On Time";
    //   // pack.date = d.addDays(-i);
    //   pack.date = moment(d.addDays(-i)).format("DD-MMM-YYYY, HH:mm");
    //   if (checkInData[i]) {
    //     // console.log(chack.bgBlue(i));
    //     // console.log(checkInData[i]);
    //     timeIn = moment(checkInData[i].check_in).format("HH:mm");
    //     timeOut = moment(checkOutData[i].check_in).format("HH:mm");

    //     //dev =====================================================
    //     // pack.timeIn = moment(checkInData[i].check_in).format(
    //     //   "DD-MMM-YYYY, HH:mm"
    //     // );
    //     // pack.timeOut = moment(checkOutData[i].check_in).format(
    //     //   "DD-MMM-YYYY, HH:mm"
    //     // );
    //     //===========================================================

    //     //production =====================================================
    //     pack.timeIn = timeIn;
    //     pack.timeOut = timeOut;
    //     //===========================================================
    //     if (timeIn > "08:00" || timeOut < "18.00") {
    //       status = "late";
    //     }
    //     if (timeIn == timeOut) {
    //       pack.timeOut = "-";
    //       console.log(chalk.bgRed("timeIn == timeOut"));
    //     }

    //     // if (timeIn > "08:00" || timeOut < "18.00") {
    //     //   status = "late";
    //     // }
    //     // if (timeIn == timeOut) {
    //     //   pack.timeOut = "-";
    //     //   console.log(chalk.bgRed("timeIn == timeOut"));
    //     // }

    //     pack.location = checkOutData[i].location;
    //     pack.status = status;

    //     // console.log(timeIn, timeOut);
    //     // console.log(status);
    //   } else {
    //     pack.status = "-";
    //   }
    //   // pack.timeIn = (await checkInData[i]) ? checkInData[i].check_in : "";
    //   // pack.timeOut = (await checkOutData[i]) ? checkOutData[i].check_in : "";
    //   // pack.location = (await checkOutData[i]) ? checkOutData[i].location : "";
    //   historyData.push(pack);
    // }
  } catch (err) {
    console.log(err);
  }

  console.log(historyData);
  res.send(historyData);
};

// create Dummy time stamp
exports.createDummy = (req, res) => {
  let curr = req.body.date
    ? moment(req.body.date).format()
    : moment().add(7, "h").format();
  curr = moment.tz(curr, "Asia/Bangkok");
  console.log(chalk.red.bold(curr));
  User.id = req.body.userId ? req.body.userId : null;
  const timeAttendance = {
    location: req.body.location ? req.body.location : "RS Tower",
    check_in: curr,
  };
  console.log(new Date(req.body.date));

  TimeAtten.create(timeAttendance)
    .then(async (data) => {
      await data.setUser(User.id);
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

// ===================================================================
