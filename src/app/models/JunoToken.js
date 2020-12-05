'use strict';
import Sequelize, { Model } from 'sequelize';

class JunoToken extends Model {
  static init(sequelize) {
    super.init({
      access_token: Sequelize.TEXT,
    }, {
      sequelize,
    });

    return this;
  }

  static associate(models) {
  }

}

export default JunoToken;