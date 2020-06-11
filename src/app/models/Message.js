'use strict';
import Sequelize, { Model } from 'sequelize';

class Message extends Model {
  static init(sequelize) {
    super.init({
      message: Sequelize.TEXT,
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

export default Message;
