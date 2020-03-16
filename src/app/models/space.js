'use strict';
import Sequelize, { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  const Space = sequelize.define('Space', {
    name: Sequelize.STRING,
    adress: Sequelize.STRING,
    city: Sequelize.STRING,
    state: Sequelize.STRING,
    country: Sequelize.STRING,
    description: Sequelize.TEXT,
    category: Sequelize.STRING,
    price: Sequelize.INTEGER,
    charge_type: Sequelize.INTEGER,
    capacity: Sequelize.INTEGER,
    features: {
      type: Sequelize.INTEGER,
      get() {
        return this.getDataValue('features').split(',');
      },
      set(val) {
        this.setDataValue('features', val.join(','));
      },
    },
    restrictions: {
      type: Sequelize.INTEGER,
      get() {
        return this.getDataValue('restrictions').split(',');
      },
      set(val) {
        this.setDataValue('restrictions', val.join(','));
      },
    },
    services: Sequelize.JSON,
    open_hour: Sequelize.STRING,
    close_hour: Sequelize.STRING,
    owner_id: Sequelize.INTEGER,
  }, {});
  Space.associate = function(models) {
    // associations can be defined here
    this.belongsTo(models.User, { foreignKey: 'owner_id' });
    this.hasMany(models.Reserve, { foreignKey: 'space_id' });
    this.hasMany(models.Image, { foreignKey: 'space_id' });
  };
  return Space;
};
