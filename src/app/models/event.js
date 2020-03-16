'use strict';
import Sequelize, { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    title: DataTypes.STRING,
    description: Sequelize.TEXT,
    category: Sequelize.STRING,
    estimated_audience: Sequelize.INTEGER,
    budget: Sequelize.INTEGER,
    target_audience: Sequelize.STRING,
    logo: Sequelize.INTEGER,
  }, {});
  Event.associate = function(models) {
    // associations can be defined here
    this.belongsTo(models.Image, { foreignKey: 'logo', as: 'event_logo' });
    this.hasMany(models.Image, { foreignKey: 'event_id', as: 'event_images' });
    this.hasMany(models.Reserve, { foreignKey: 'event_id' });
  };
  return Event;
};
