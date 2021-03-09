const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const UserInfo = db.userInfo;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const chalk = require("chalk");

exports.signup = (req, res) => {
  // Save User to Database
  // let data = {
  //   username: req.body.username,
  //   email: req.body.email,
  //   password: bcrypt.hashSync(req.body.password, 8),
  // };

  let userInfo = {
    firstName: req.body.firstName ? req.body.firstName : null,
    lastName: req.body.lastName ? req.body.lastName : null,
  };

  console.log(userInfo);

  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      console.log(
        chalk.bgWhiteBright("==============================================")
      );
      console.log(user.dataValues.id);
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            UserInfo.create(userInfo).then(async (data) => {
              await data.setUser(user.dataValues.id);
              res.send({ message: "User was registered successfully! 3" });
            });
            res.send({ message: "User was registered successfully! 1" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(async () => {
          await UserInfo.create(userInfo).then(async (data) => {
            await data.setUser(user.dataValues.id);
            res.send({ message: "User was registered successfully! 2" });
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign(
        { id: user.id },
        config.privateKEY,
        config.signOptions
      );

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
