import Sequelize, { Model } from 'sequelize';

class Account extends Model {
  static init(sequelize) {
    super.init({
      user_id: Sequelize.INTEGER,
      account_type: Sequelize.STRING,
      cpf_cnpj: Sequelize.STRING,
      date_of_birth: Sequelize.STRING,
      phone_number: Sequelize.STRING,
      post_code: Sequelize.STRING,
      adress: Sequelize.STRING,
      adress_number: Sequelize.STRING,
      complement: Sequelize.STRING,
      city: Sequelize.STRING,
      state: Sequelize.STRING,
      country: Sequelize.STRING,
      business_area: Sequelize.STRING,
      business_url: Sequelize.STRING,
      company_type: Sequelize.STRING,
      trading_name: Sequelize.STRING,
      legal_representative_name: Sequelize.STRING,
      legal_representative_document: Sequelize.STRING,
      legal_representative_date_of_birth: Sequelize.STRING,
      account_status: Sequelize.STRING,
      default: Sequelize.BOOLEAN,
      register_step: Sequelize.INTEGER,
    }, {
      sequelize,
    });

    return this;
  }

  static associate(models) {
    this.hasOne(models.BankAccount, { foreignKey: 'account_id' });
    this.hasOne(models.JunoAccount, { foreignKey: 'account_id' });
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

export default Account;
