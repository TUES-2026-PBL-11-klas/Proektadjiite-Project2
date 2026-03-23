const { Sequelize } = require('sequelize');
const UserModel = require('./user');
const ReportModel = require('./report');
const VoteModel = require('./vote');
const StatusHistoryModel = require('./statusHistory');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const User = UserModel(sequelize);
const Report = ReportModel(sequelize);
const Vote = VoteModel(sequelize);
const StatusHistory = StatusHistoryModel(sequelize);

// Define relationships
User.hasMany(Report, { foreignKey: 'user_id' });
Report.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Vote, { foreignKey: 'user_id' });
Vote.belongsTo(User, { foreignKey: 'user_id' });

Report.hasMany(Vote, { foreignKey: 'report_id' });
Vote.belongsTo(Report, { foreignKey: 'report_id' });

User.hasMany(StatusHistory, { foreignKey: 'changed_by' });
StatusHistory.belongsTo(User, { foreignKey: 'changed_by' });

Report.hasMany(StatusHistory, { foreignKey: 'report_id' });
StatusHistory.belongsTo(Report, { foreignKey: 'report_id' });

module.exports = { sequelize, User, Report, Vote, StatusHistory };
