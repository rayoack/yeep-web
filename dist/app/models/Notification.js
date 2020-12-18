"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }'use strict';
var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class Notification extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      content: _sequelize2.default.TEXT,
      type: _sequelize2.default.STRING,
      type_id: _sequelize2.default.INTEGER,
    }, {
      sequelize,
    });
    return this;
  }

  static associate(models) {
    // associations can be defined here
    this.belongsTo(models.User, { foreignKey: 'sender_id', as: 'sender' });
    this.belongsTo(models.User, { foreignKey: 'target_id', as: 'receiver' });
  }
}

exports. default = Notification;
