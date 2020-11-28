import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.VIRTUAL,
      password_hash: Sequelize.STRING,
      role: Sequelize.STRING,
      adress: Sequelize.STRING,
      city: Sequelize.STRING,
      state: Sequelize.STRING,
      country: Sequelize.STRING,
      monetary_unit: Sequelize.STRING,
      new_user: Sequelize.BOOLEAN,
      cpf_cnpj: Sequelize.STRING,
      date_of_birth: Sequelize.STRING,
      phone_number: Sequelize.STRING,
      post_code: Sequelize.STRING,
      adress_number: Sequelize.STRING,
    }, {
      sequelize,
    });

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Space, { foreignKey: 'owner_id' });
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
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
