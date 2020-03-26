import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Reserve extends Model {
  static init(sequelize) {
    super.init({
      approve: Sequelize.BOOLEAN,
      message: Sequelize.TEXT,
      start_date: Sequelize.DATE,
      end_date: Sequelize.DATE,
      start_hour: Sequelize.STRING,
      end_hour: Sequelize.STRING,
      canceled_at: Sequelize.DATE,
      space_id: Sequelize.INTEGER,
      event_id: Sequelize.INTEGER,
      past: {
        type: Sequelize.VIRTUAL,
        get() {
          return isBefore(this.date, new Date());
        },
      },
      cancelable: {
        type: Sequelize.VIRTUAL,
        get() {
          return isBefore(new Date(), subHours(this.date, 2));
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

export default Reserve;
