"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }'use strict';
var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class UsersEvents extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      user_id: {
        type: _sequelize2.default.INTEGER,
        references: {
          model: 'User',
          key: 'id',
        },
      },
      event_id: {
        type: _sequelize2.default.INTEGER,
        references: {
          model: 'Event',
          key: 'id',
        },
      },
    }, {
      sequelize,
    });
    return this;
  }

  // static associate(models) {
  //   models.User.belongsToMany(models.Event, { through: 'UsersEvents' });
  //   models.Event.belongsToMany(models.User, { through: 'UsersEvents' });
  // }
}

exports. default = UsersEvents;
