'use strict';
module.exports = (sequelize, DataTypes) => {
  const Space = sequelize.define('Space', {
    name: DataTypes.STRING
  }, {});
  Space.associate = function(models) {
    // associations can be defined here
  };
  return Space;
};