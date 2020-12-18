"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }'use strict';
var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class Space extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      name: _sequelize2.default.STRING,
      adress: _sequelize2.default.STRING,
      city: _sequelize2.default.STRING,
      state: _sequelize2.default.STRING,
      country: _sequelize2.default.STRING,
      description: _sequelize2.default.TEXT,
      category: _sequelize2.default.STRING,
      monetary_unit: _sequelize2.default.STRING,
      price: _sequelize2.default.INTEGER,
      charge_type: _sequelize2.default.INTEGER,
      capacity: _sequelize2.default.INTEGER,
      features: _sequelize2.default.STRING,
      restrictions: _sequelize2.default.STRING,
      open_hour: _sequelize2.default.STRING,
      close_hour: _sequelize2.default.STRING,
      has_parking: _sequelize2.default.BOOLEAN,
      parking_features: _sequelize2.default.STRING,
      parking_description: _sequelize2.default.TEXT,
      owner_id: _sequelize2.default.INTEGER,
      visible: _sequelize2.default.BOOLEAN,
      register_step: _sequelize2.default.INTEGER,
    }, {
      sequelize,
    });
    return this;
  }

  static associate(models) {
    // associations can be defined here
    this.hasMany(models.Service, { foreignKey: 'space_id' });
    this.belongsTo(models.User, { foreignKey: 'owner_id' });
    this.hasMany(models.Reserve, { foreignKey: 'space_id' });
    this.hasMany(models.Image, { foreignKey: 'space_id' });
  };
};

exports. default = Space;
