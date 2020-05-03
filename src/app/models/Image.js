import Sequelize, { Model } from 'sequelize';

class Image extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      url: Sequelize.STRING,
    }, {
      sequelize,
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Space, { foreignKey: 'space_id' });
    this.belongsTo(models.Event, { foreignKey: 'event_id' });
    this.belongsTo(models.Service, { foreignKey: 'service_id' });
  }
}

export default Image;
