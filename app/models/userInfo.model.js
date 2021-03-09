module.exports = (sequelize, Sequelize) => {
  const UserInfo = sequelize.define("User_Info", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
    },
  });

  return UserInfo;
};
