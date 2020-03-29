'use strict';
import Sequelize, { Model } from 'sequelize';

class UsersEvents extends Model {
  static init(sequelize) {
    super.init({
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'User',
          key: 'id',
        },
      },
      event_id: {
        type: Sequelize.INTEGER,
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

export default UsersEvents;
