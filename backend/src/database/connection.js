const Sequelize = require("sequelize");

const sequelize = new Sequelize("goofvsfry2020", "root", "1391", {
  host: "127.0.0.1",
  dialect: "mysql",
});

module.exports = sequelize;
global.sequelize = sequelize;
