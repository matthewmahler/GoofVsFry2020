const Sequelize = require("sequelize");

module.exports = sequelize.define("Viewer", {
  userId: {
    type: Sequelize.INTEGER(100),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  username: { type: Sequelize.STRING(100), allowNull: false },
  lastWatchDate: Sequelize.DATE(),
  lastVoteDate: Sequelize.DATE(),
});
