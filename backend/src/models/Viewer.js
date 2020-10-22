const Sequelize = require("sequelize");

module.exports = sequelize.define("Viewer", {
  username: { type: Sequelize.STRING(100), allowNull: false, primaryKey: true },
  lastWatchDate: Sequelize.DATE,
  lastVoteDate: Sequelize.DATE,
});
