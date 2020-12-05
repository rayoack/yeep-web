'use strict';
import Sequelize, { Model } from 'sequelize';

class JunoAccount extends Model {
  static init(sequelize) {
    super.init({
      account_id: Sequelize.INTEGER,
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
    this.belongsTo(models.Account, { foreignKey: 'account_id' });
  }

}

export default JunoAccount;