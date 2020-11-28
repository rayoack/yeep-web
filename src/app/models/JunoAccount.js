'use strict';
import Sequelize, { Model } from 'sequelize';

class JunoAccount extends Model {
  static init(sequelize) {
    super.init({
      user_id: Sequelize.INTEGER,
      juno_id: Sequelize.INTEGER,
      resource_token: Sequelize.STRING,
      account_type: Sequelize.STRING,
      account_status: Sequelize.STRING
    }, {
      sequelize,
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }

}

export default JunoAccount;