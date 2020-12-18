"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }'use strict';
var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class JunoToken extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      access_token: _sequelize2.default.TEXT,
    }, {
      sequelize,
    });

    return this;
  }

  static associate(models) {
  }

}

exports. default = JunoToken;