import Sequelize, { Model } from 'sequelize';

class Image extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      space_id: Sequelize.INTEGER,
      event_id: Sequelize.INTEGER,
      url: {
        type: Sequelize.VIRTUAL,
        get() {
          return `${ process.env.APP_URL }/files/${ this.path }`;
        },
      },
    }, {
      sequelize,
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Space, { foreignKey: 'space_id' });
    this.belongsTo(models.Event, { foreignKey: 'event_id' });
  }
}

export default Image;
