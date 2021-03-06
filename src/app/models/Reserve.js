import Sequelize, { Model } from 'sequelize';
import { isBefore, subDays, parseISO } from 'date-fns';
import isPast from 'date-fns/isPast'
import isFuture from 'date-fns/isFuture'

class Reserve extends Model {
  static init(sequelize) {
    super.init({
      message: Sequelize.TEXT,
      amount: Sequelize.INTEGER,
      canceled_at: Sequelize.DATE,
      space_id: Sequelize.INTEGER,
      event_id: Sequelize.INTEGER,
      service_id: Sequelize.INTEGER,
      quantity: Sequelize.INTEGER,
      status: Sequelize.STRING,
      type: Sequelize.STRING,
      additional_values: Sequelize.JSON,
      start_date: Sequelize.DATE,
      end_date: Sequelize.DATE,
      last_message_target_id: Sequelize.INTEGER,
      last_message_target_read: Sequelize.BOOLEAN,
      past: {
        type: Sequelize.VIRTUAL,
        get() {
          return isPast(this.end_date);
        },
      },
      cancelable: {
        type: Sequelize.VIRTUAL,
        get() {
          return isBefore(new Date(), subDays(this.start_date, 7));
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
