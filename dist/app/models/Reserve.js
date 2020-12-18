"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _datefns = require('date-fns');

class Reserve extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      message: _sequelize2.default.TEXT,
      dates: _sequelize2.default.JSON,
      amount: _sequelize2.default.INTEGER,
      canceled_at: _sequelize2.default.DATE,
      space_id: _sequelize2.default.INTEGER,
      event_id: _sequelize2.default.INTEGER,
      service_id: _sequelize2.default.INTEGER,
      status: _sequelize2.default.STRING,
      type: _sequelize2.default.STRING,
      additional_values: _sequelize2.default.JSON,
      startDate: {
        type: _sequelize2.default.VIRTUAL,
        get() {
          return this.dates[0].full_date;
        },
      },
      past: {
        type: _sequelize2.default.VIRTUAL,
        get() {
          return _datefns.isBefore.call(void 0, this.startDate, new Date());
        },
      },
      cancelable: {
        type: _sequelize2.default.VIRTUAL,
        get() {
          return _datefns.isBefore.call(void 0, new Date(), _datefns.subDays.call(void 0, this.startDate, 10));
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
