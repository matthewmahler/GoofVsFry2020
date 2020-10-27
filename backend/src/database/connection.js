const Sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();
const { MYSQL_USERNAME, MYSQL_HOST, MYSQL_PASSWORD } = process.env;
const sequelize = new Sequelize("goofvsfry", MYSQL_USERNAME, MYSQL_PASSWORD, {
  host: MYSQL_HOST,
  dialect: "mysql",
});

module.exports = sequelize;
global.sequelize = sequelize;
