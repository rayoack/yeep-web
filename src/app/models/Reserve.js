import Sequelize, { Model } from 'sequelize';
import { isBefore, subDays } from 'date-fns';

class Reserve extends Model {
  static init(sequelize) {
    super.init({
      message: Sequelize.TEXT,
      dates: Sequelize.JSON,
      amount: Sequelize.INTEGER,
      canceled_at: Sequelize.DATE,
      space_id: Sequelize.INTEGER,
      event_id: Sequelize.INTEGER,
      service_id: Sequelize.INTEGER,
      quantity: Sequelize.INTEGER,
      status: Sequelize.STRING,
      type: Sequelize.STRING,
      additional_values: Sequelize.JSON,
      startDate: {
        type: Sequelize.VIRTUAL,
        get() {
          return this.dates[0].full_date;
        },
      },
      past: {
        type: Sequelize.VIRTUAL,
        get() {
          return isBefore(this.startDate, new Date());
        },
      },
      cancelable: {
        type: Sequelize.VIRTUAL,
        get() {
          return isBefore(new Date(), subDays(this.startDate, 10));
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
    this.belongsTo(models.Service, { foreignKey: 'service_id' });
  }
}

export default Reserve;
