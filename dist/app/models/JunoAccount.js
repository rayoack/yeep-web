"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }'use strict';
var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class JunoAccount extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      account_id: _sequelize2.default.INTEGER,
      juno_id: _sequelize2.default.INTEGER,
      resource_token: _sequelize2.default.STRING,
      account_type: _sequelize2.default.STRING,
      account_status: _sequelize2.default.STRING
    }, {
      sequelize,
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Account, { foreignKey: 'account_id' });
  }

}

exports. default = JunoAccount;