const fs = require("fs");
const path = require("path");

var i = "iconext";
var s = "wichayut";
var a = "http://iconext.co.th";

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
