const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: 0,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.time_attendance = require("../models/time_attendance.model")(
  sequelize,
  Sequelize
);

db.userInfo = require("../models/userInfo.model")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

db.user.hasMany(db.time_attendance, { as: "TimeAttendance" });
db.time_attendance.belongsTo(db.user, {
  foreignKey: "userId",
  as: "User",
});

db.user.hasOne(db.userInfo, { as: "UserInfo" });
db.userInfo.belongsTo(db.user, {
  foreignKey: "userId",
  as: "User",
});

db.ROLES = ["user", "admin", "manager"];

module.exports = db;
