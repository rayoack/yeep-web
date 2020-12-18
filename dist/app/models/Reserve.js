"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _datefns = require('date-fns');
var _isPast = require('date-fns/isPast'); var _isPast2 = _interopRequireDefault(_isPast);
var _isFuture = require('date-fns/isFuture'); var _isFuture2 = _interopRequireDefault(_isFuture);

class Reserve extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      message: _sequelize2.default.TEXT,
      amount: _sequelize2.default.INTEGER,
      canceled_at: _sequelize2.default.DATE,
      space_id: _sequelize2.default.INTEGER,
      event_id: _sequelize2.default.INTEGER,
      service_id: _sequelize2.default.INTEGER,
      quantity: _sequelize2.default.INTEGER,
      status: _sequelize2.default.STRING,
      type: _sequelize2.default.STRING,
      additional_values: _sequelize2.default.JSON,
      start_date: _sequelize2.default.DATE,
      end_date: _sequelize2.default.DATE,
      last_message_target_id: _sequelize2.default.INTEGER,
      last_message_target_read: _sequelize2.default.BOOLEAN,
      past: {
        type: _sequelize2.default.VIRTUAL,
        get() {
          return _isPast2.default.call(void 0, this.end_date);
        },
      },
      cancelable: {
        type: _sequelize2.default.VIRTUAL,
        get() {
          return _datefns.isBefore.call(void 0, new Date(), _datefns.subDays.call(void 0, this.start_date, 7));
        },
      },
    }, {
      sequelize,
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Space, { foreignKey: 'space_id' });
    this.belongsTo(models.Event, { foreignKey: 'event_id' });
    this.belongsTo(models.Service, { foreignKey: 'service_id' });
  }
}

exports. default = Reserve;
