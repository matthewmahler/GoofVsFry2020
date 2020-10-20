const Sequelize = require("sequelize");

module.exports = sequelize.define("Vote", {
  id: {
    type: Sequelize.INTEGER(100),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  username: Sequelize.STRING(100),
  voteDate: Sequelize.DATE(),
  candidate: Sequelize.STRING(45),
});
