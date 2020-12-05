import Sequelize, { Model } from 'sequelize';

class BankAccount extends Model {
  static init(sequelize) {
    super.init({
      account_id: Sequelize.INTEGER,
      bank_number: Sequelize.STRING,
      agency_number: Sequelize.STRING,
      account_number: Sequelize.STRING,
      account_complement_number: Sequelize.STRING,
      account_type: Sequelize.STRING,
      account_holder_name: Sequelize.STRING,
      account_holder_document: Sequelize.STRING
    }, {
      sequelize,
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Account, { foreignKey: 'account_id' });
  }
}

export default BankAccount;
