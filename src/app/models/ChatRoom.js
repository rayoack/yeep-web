import Sequelize, { Model } from 'sequelize';
import { isBefore, subDays, parseISO } from 'date-fns';
import isPast from 'date-fns/isPast'
import isFuture from 'date-fns/isFuture'

class ChatRoom extends Model {
  static init(sequelize) {
    super.init({
        room_name: Sequelize.STRING,
        host_id: Sequelize.INTEGER,
        organizer_id: Sequelize.INTEGER,
        reserve_id: Sequelize.INTEGER,
        type: Sequelize.STRING,
        last_message_target_id: Sequelize.INTEGER,
        last_message_target_read: Sequelize.BOOLEAN,
    }, {
        sequelize,
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Reserve, { foreignKey: 'reserve_id' });
    this.belongsTo(models.User, { foreignKey: 'host_id', as: 'host' });
    this.belongsTo(models.User, { foreignKey: 'organizer_id', as: 'organizer' });
  }
}

export default ChatRoom;
