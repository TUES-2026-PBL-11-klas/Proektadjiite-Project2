const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('StatusHistory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    report_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    changed_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    old_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    new_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
    },
    changed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'status_history',
    timestamps: false,
  });
};
