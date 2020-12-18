"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }'use strict';
var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class Event extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      title: _sequelize2.default.STRING,
      description: _sequelize2.default.TEXT,
      category: _sequelize2.default.STRING,
      estimated_audience: _sequelize2.default.INTEGER,
      budget: _sequelize2.default.INTEGER,
      target_audience: _sequelize2.default.STRING,
      logo: _sequelize2.default.INTEGER,
      dates: _sequelize2.default.JSON,
      nomenclature: _sequelize2.default.STRING,
      visible: _sequelize2.default.BOOLEAN,
      location_name: _sequelize2.default.STRING,
      adress: _sequelize2.default.STRING,
      state: _sequelize2.default.STRING,
      city: _sequelize2.default.STRING,
      country: _sequelize2.default.STRING,
      online: _sequelize2.default.BOOLEAN,
      register_step: _sequelize2.default.INTEGER,
    }, {
      sequelize,
    });
    return this;
  }

  static associate(models) {
    // associations can be defined here
    this.belongsTo(models.Image, { foreignKey: 'logo', as: 'event_logo' });
    this.hasMany(models.Image, { foreignKey: 'event_id', as: 'event_images' });
    this.hasMany(models.Reserve, { foreignKey: 'event_id' });
    this.hasMany(models.Ticket, { foreignKey: 'event_id' });
    this.belongsToMany(models.User, {
      through: 'UsersEvents',
      as: 'users',
      foreignKey: 'event_id'
    });
  }
}

exports. default = Event;
