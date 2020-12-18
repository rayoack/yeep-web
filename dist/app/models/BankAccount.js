"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class BankAccount extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      account_id: _sequelize2.default.INTEGER,
      bank_number: _sequelize2.default.STRING,
      agency_number: _sequelize2.default.STRING,
      account_number: _sequelize2.default.STRING,
      account_complement_number: _sequelize2.default.STRING,
      account_type: _sequelize2.default.STRING,
      account_holder_name: _sequelize2.default.STRING,
      account_holder_document: _sequelize2.default.STRING
    }, {
      sequelize,
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Account, { foreignKey: 'account_id' });
  }
}

exports. default = BankAccount;
