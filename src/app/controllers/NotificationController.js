import User from '../models/User';
import Image from '../models/Image';
import Notification from '../models/Notification';

class NotificationController {
  async index(req, res) {

    const notifications = await Notification.findAll(
      {
        where: {
          target_id: req.userId
        },
        order: [
          ['createdAt', 'DESC'],
        ],
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'name'],
            include: [
              {
                model: Image,
                as: 'avatar',
                attributes: ['id', 'name', 'url'],
              }
            ]
          }
        ],
      }
    )

    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notification.findByPk(req.params.id)

    await notification.update({
      read: true
    })

    return res.json(notification);
  }
}

export default new NotificationController();
