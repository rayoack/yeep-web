"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }'use strict';
var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class Ticket extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      name: _sequelize2.default.STRING,
      type: _sequelize2.default.STRING,
      monetary_unit: _sequelize2.default.STRING,
      quantity: _sequelize2.default.INTEGER,
      price: _sequelize2.default.DECIMAL,
      sold_by: _sequelize2.default.STRING,
      sales_start: _sequelize2.default.DATE,
      sales_end: _sequelize2.default.DATE,
      ticket_availability: _sequelize2.default.STRING,
      minimum_purchase: _sequelize2.default.INTEGER,
      maximum_purchase: _sequelize2.default.INTEGER,
      access_ticket: _sequelize2.default.STRING,
      ticket_description: _sequelize2.default.TEXT,
      visible: _sequelize2.default.BOOLEAN,
    }, {
      sequelize,
    });
    return this;
  }

  static associate(models) {
    // associations can be defined here
    this.belongsTo(models.Event, { foreignKey: 'event_id' });
  }
}

exports. default = Ticket;
