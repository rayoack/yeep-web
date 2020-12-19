"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }'use strict';
var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class Service extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      name: _sequelize2.default.STRING,
      category: _sequelize2.default.STRING,
      description: _sequelize2.default.TEXT,
      features: _sequelize2.default.STRING,
      restrictions: _sequelize2.default.STRING,
      adress: _sequelize2.default.STRING,
      city: _sequelize2.default.STRING,
      state: _sequelize2.default.STRING,
      country: _sequelize2.default.STRING,
      monetary_unit: _sequelize2.default.STRING,
      max_quantity: _sequelize2.default.INTEGER,
      price: _sequelize2.default.DECIMAL,
      charge_type: _sequelize2.default.STRING,
      visibility: _sequelize2.default.BOOLEAN,
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
  }
}

exports. default = Service;
