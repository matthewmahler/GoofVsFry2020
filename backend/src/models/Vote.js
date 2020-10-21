const Sequelize = require("sequelize");

module.exports = sequelize.define("Vote", {
  userId: {
    type: Sequelize.INTEGER(100),
    allowNull: false,
  },
  voteId: {
    type: Sequelize.INTEGER(100),
    allowNull: false,
    primaryKey: true,
  },
  username: { type: Sequelize.STRING(100), allowNull: false },
  voteDate: { type: Sequelize.DATE, allowNull: false },
  candidate: { type: Sequelize.STRING(45), allowNull: false },
});
