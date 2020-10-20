const Sequelize = require("sequelize");

module.exports = sequelize.define("Viewer", {
  id: {
    type: Sequelize.INTEGER(100),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  username: Sequelize.STRING(100),
  lastWatchDate: Sequelize.DATE(),
  lastVoteDate: Sequelize.DATE(),
});
