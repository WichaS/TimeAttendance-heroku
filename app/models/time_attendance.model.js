module.exports = (sequelize, Sequelize) => {
  const time_attendance = sequelize.define("time_attendance", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    check_in: { type: Sequelize.DATE },
    location: { type: Sequelize.STRING },
  });

  return time_attendance;
};
