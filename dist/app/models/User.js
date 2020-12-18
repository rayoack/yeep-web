"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _bcryptjs = require('bcryptjs'); var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

class User extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      name: _sequelize2.default.STRING,
      email: _sequelize2.default.STRING,
      password: _sequelize2.default.VIRTUAL,
      password_hash: _sequelize2.default.STRING,
      role: _sequelize2.default.STRING,
      adress: _sequelize2.default.STRING,
      city: _sequelize2.default.STRING,
      state: _sequelize2.default.STRING,
      country: _sequelize2.default.STRING,
      monetary_unit: _sequelize2.default.STRING,
      new_user: _sequelize2.default.BOOLEAN,
    }, {
      sequelize,
    });

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await _bcryptjs2.default.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Space, { foreignKey: 'owner_id' });
    this.hasMany(models.Service, { foreignKey: 'provider_id' });
    this.belongsTo(models.Image, { foreignKey: 'avatar_id', as: 'avatar' });
    this.belongsToMany(models.Event, {
      through: 'UsersEvents',
      as: 'events',
      foreignKey: 'user_id'
    });
  }

  checkPassword(password) {
    return _bcryptjs2.default.compare(password, this.password_hash);
  }
}

exports. default = User;
