
import Reserve from '../models/Reserve';
import User from '../models/User';
import Event from '../models/event';
import Image from '../models/Image';
import Space from '../models/Space';
import Service from '../models/Service';
import Message from '../models/Message';
import ChatRoom from '../models/ChatRoom';

class ChatRoomController {
  async store(req, res) {
    return res.json();
  }

  async index(req, res) {
    let options = {
        where: {},
        order: [
            ['updatedAt', 'DESC'],
        ],
        limit: 10,
        offset: (req.params.page - 1) * 10,
        include: [
            {
                model: Reserve,
                attributes: [
                  'id',
                  'status',
                  'event_title',
                ],
                include: {
                    model: Space,
                    attributes: [
                      'id',
                      'name',
                      'category',
                    ],
                    include: {
                      model: Image,
                      attributes: ['id', 'name', 'url'],
                    },
                },
            },
            {
                model: User,
                as: 'host',
                attributes: ['id', 'name'],
                include: {
                    model: Image,
                    as: 'avatar',
                    attributes: ['id', 'name', 'url'],
                },
            },
            {
                model: User,
                as: 'organizer',
                attributes: ['id', 'name'],
                include: {
                    model: Image,
                    as: 'avatar',
                    attributes: ['id', 'name', 'url'],
                },
            },
        ],
    }

    if(req.query.request_type ==='organizer') {
        options.where.organizer_id = req.params.id;
    } else if(req.query.request_type ==='host') {
        options.where.host_id = req.params.id
    };

    if(req.body.filter && req.body.filter.type) {
        options.where.type = req.body.filter.type;
    };

    const rooms = await ChatRoom.findAll(options);

    return res.json(rooms);
  }

  async update(req, res) {
    const room = await ChatRoom.findByPk(req.params.id);

    if(!room) return res.status(404).json({ error: 'Chat room not found.' })

    await room.update(req.body)

    return res.json(room);
  }

  async show(req, res) {
    return res.json();
  }

  async destroy(req, res) {
    return res.json();
  }
}

export default new ChatRoomController();
