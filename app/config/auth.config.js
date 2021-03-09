const fs = require("fs");
const path = require("path");

var i = "iconext"; // Issuer (Software organization who issues the token)
var s = "sippavit"; // Subject (intended user of the token)
var a = "http://iconext.co.th"; // Audience (Domain within which this token will live and function)

var publicKEY = fs.readFileSync(path.join(__dirname + "/public.key"), "utf8");
var privateKEY = fs.readFileSync(path.join(__dirname + "/private.key"), "utf8");
var expiresIn = 86400; // 24 hours;

module.exports = {
  secret: "Wicha-key",
  signOptions: {
    issuer: i,
    subject: s,
    audience: a,
    expiresIn: expiresIn,
    algorithm: "RS256",
  },
  publicKEY,
  privateKEY,
};
