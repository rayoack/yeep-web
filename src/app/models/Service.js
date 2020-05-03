'use strict';
import Sequelize, { Model } from 'sequelize';

class Service extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      category: Sequelize.STRING,
      description: Sequelize.TEXT,
      features: Sequelize.STRING,
      restrictions: Sequelize.STRING,
      adress: Sequelize.STRING,
      city: Sequelize.STRING,
      state: Sequelize.STRING,
      country: Sequelize.STRING,
      monetary_unit: Sequelize.STRING,
      max_quantity: Sequelize.INTEGER,
      price: Sequelize.DECIMAL,
      charge_type: Sequelize.STRING,
      visibility: Sequelize.BOOLEAN,
    }, {
      sequelize,
    });
    return this;
  }

  static associate(models) {
    // associations can be defined here
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Space, { foreignKey: 'space_id' });
    this.belongsTo(models.Image, { foreignKey: 'logo_id', as: 'service_logo' });
    this.hasMany(models.Image, { foreignKey: 'service_id', as: 'service_images' });
    this.hasMany(models.Reserve, { foreignKey: 'service_id' });
  }
}

export default Service;
