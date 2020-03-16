'use strict';
import Sequelize, { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  const UsersEvents = sequelize.define('UsersEvents', {
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
        model: 'User',
        key: 'id',
      },
    },
  }, {});
  UsersEvents.associate = function(models) {
    // associations can be defined here
    models.User.belongsToMany(models.Event, { through: 'UsersEvents' });
    models.Event.belongsToMany(models.User, { through: 'UsersEvents' });
  };

  return UsersEvents;
};
