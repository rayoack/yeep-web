"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }'use strict';
var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class Message extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      message: _sequelize2.default.TEXT,
      sender_name: _sequelize2.default.STRING,
      sender_avatar: _sequelize2.default.STRING,
    }, {
      sequelize,
    });
    return this;
  }

  static associate(models) {
    // associations can be defined here
    this.belongsTo(models.User, { foreignKey: 'sender_id', as: 'sender' });
    this.belongsTo(models.User, { foreignKey: 'receiver_id', as: 'receiver' });
    this.belongsTo(models.Reserve, { foreignKey: 'room_id' });
    this.belongsTo(models.Image, { foreignKey: 'image_id' });
  }
}

exports. default = Message;
