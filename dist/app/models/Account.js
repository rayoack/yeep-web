"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class Account extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      user_id: _sequelize2.default.INTEGER,
      account_type: _sequelize2.default.STRING,
      cpf_cnpj: _sequelize2.default.STRING,
      date_of_birth: _sequelize2.default.STRING,
      phone_number: _sequelize2.default.STRING,
      post_code: _sequelize2.default.STRING,
      adress: _sequelize2.default.STRING,
      adress_number: _sequelize2.default.STRING,
      complement: _sequelize2.default.STRING,
      city: _sequelize2.default.STRING,
      state: _sequelize2.default.STRING,
      country: _sequelize2.default.STRING,
      business_area: _sequelize2.default.STRING,
      business_url: _sequelize2.default.STRING,
      company_type: _sequelize2.default.STRING,
      trading_name: _sequelize2.default.STRING,
      legal_representative_name: _sequelize2.default.STRING,
      legal_representative_document: _sequelize2.default.STRING,
      legal_representative_date_of_birth: _sequelize2.default.STRING,
      account_status: _sequelize2.default.STRING,
      default: _sequelize2.default.BOOLEAN,
      register_step: _sequelize2.default.INTEGER,
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

exports. default = Account;
