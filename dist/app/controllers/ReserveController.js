"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _datefns = require('date-fns');
var _ptBR = require('date-fns/locale/pt-BR'); var _ptBR2 = _interopRequireDefault(_ptBR);
var _enUS = require('date-fns/locale/en-US'); var _enUS2 = _interopRequireDefault(_enUS);

var _Reserve = require('../models/Reserve'); var _Reserve2 = _interopRequireDefault(_Reserve);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _Event = require('../models/Event'); var _Event2 = _interopRequireDefault(_Event);
var _Image = require('../models/Image'); var _Image2 = _interopRequireDefault(_Image);
var _Message = require('../models/Message'); var _Message2 = _interopRequireDefault(_Message);
var _Space = require('../models/Space'); var _Space2 = _interopRequireDefault(_Space);
var _Service = require('../models/Service'); var _Service2 = _interopRequireDefault(_Service);
var _Notification = require('../models/Notification'); var _Notification2 = _interopRequireDefault(_Notification);

class ReserveController {

  async index(req, res) {
    const { page } = req.params;
    let reserves = []

    if(req.query.request_type == 'space') {
      reserves = await _Reserve2.default.findAll({
        where: { space_id: req.params.id, canceled_at: null },
        order: [
          ['updatedAt', 'DESC'],
        ],
        limit: 20,
        offset: (page - 1) * 20,
        include: [
          {
            model: _Event2.default,
            attributes: [
              'id',
              'title',
              'category'
            ],
            include: {
              model: _Image2.default,
              as: 'event_logo',
              attributes: ['id', 'name', 'url'],
            },
          },
        ],
      });
    } else if (req.query.request_type == 'event') {

      reserves = await _Reserve2.default.findAll({
        where: { event_id: req.params.id, canceled_at: null },
        order: [
          ['updatedAt', 'DESC'],
        ],
        limit: 20,
        offset: (page - 1) * 20,
        include: [
          {
            model: _Space2.default,
            attributes: [
              'id',
              'name',
              'category',
              'adress',
              'city',
              'state',
              'state',
              'country',
            ],
            include: {
              model: _Image2.default,
              attributes: ['id', 'name', 'url'],
            },
          },
        ],
      });

    } else if (req.query.request_type == 'organizer') {

      reserves = await _Reserve2.default.findAll({
        where: { organizer_id: req.params.id, canceled_at: null },
        order: [
          ['updatedAt', 'DESC'],
        ],
        limit: 20,
        offset: (page - 1) * 20,
        include: [
          {
            model: _Space2.default,
            attributes: [
              'id',
              'name',
              'category',
              'adress',
              'city',
              'state',
              'state',
              'country',
            ],
            include: {
              model: _Image2.default,
              attributes: ['id', 'name', 'url'],
            },
          },
        ],
      });
    } else if (req.query.request_type == 'host') {
      reserves = await _Reserve2.default.findAll({
        where: { host_id: req.params.id, canceled_at: null },
        order: [
          ['updatedAt', 'DESC'],
        ],
        limit: 20,
        offset: (page - 1) * 20,
        include: [
          {
            model: _Event2.default,
            attributes: [
              'id',
              'title',
              'category'
            ],
            include: {
              model: _Image2.default,
              as: 'event_logo',
              attributes: ['id', 'name', 'url'],
            },
          },
        ],
      });
    }

    return res.json(reserves);
  }

  async store(req, res) {
    /**
     * Validate user input data.
     */
    const schema = Yup.object().shape({
      space_id: Yup.number(),
      message: Yup.string(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    let {
      space_id,
      quantity,
      amount,
      message,
      status,
      startDate,
      endDate
    } = req.body;

    let space = {}

    // SPACE RESERVE ----
    if(space_id != null) {
      space = await _Space2.default.findOne({ where: { id: space_id } });

      if (!space) {
        return res.status(422).json({ error: "Space not found" });
      }

      /**
       * Check if space_id is the current user.
       */
      if (space.owner_id === req.userId) {
        return res.status(422).json({ error: "You can't create a schedule for yourself." });
      }
    }

    /**
     * Create reserve.
     */
    const {id: reserve_id} = await _Reserve2.default.create({
      space_id,
      owner_id: space.owner_id,
      organizer_id: req.userId,
      message,
      amount,
      quantity,
      status,
      startDate,
      endDate,
      ...req.body
    });

    /**
     * Notify appointment provider.
     */
    const notification = await _Notification2.default.create({
      target_id: space.owner_id,
      sender_id: req.userId,
      type: 'newSpaceReserve',
      type_id: reserve_id,
      content: space.name,
    });

    const ownerSocket = req.connectedUsers[notification.target_id];

    if (ownerSocket) {
      req.io.to(ownerSocket).emit('notification', notification);
    }

    // Create first message.
    if(message == null) {
      message = `newReserveSolicitation`
    }

    const newMessage = await _Message2.default.create({
      message,
      room_id: reserve_id,
      sender_id: req.userId,
      receiver_id: space.owner_id,
    })

    return res.json({
      reserve_id,
      space_id,
      event_id,
      owner_id: space.owner_id,
      organizer_id: req.userId,
      message,
      amount,
      quantity,
      status,
      startDate,
      endDate,
      ...req.body
    });
  }

  async show(req, res) {
    const reserve = await _Reserve2.default.findByPk(req.params.id, {
      include: [
        {
          model: _Event2.default,
          attributes: ['id', 'title', 'category', 'description', 'dates'],
          include: [
            {
              model: _Image2.default,
              as: 'event_logo',
              attributes: ['id', 'name', 'url'],
            },
            {
              model: _User2.default,
              as: 'users',
              attributes: ['id', 'name'],
              through: { attributes: [] },
            },
          ],
        },
        {
          model: _Space2.default,
          attributes: [
            'id',
            'name',
            'description',
            'category',
            'price',
            'charge_type',
            'monetary_unit'
          ],
          include: [
            {
              model: _Image2.default,
              attributes: ['id', 'name', 'url'],
            },
          ],
        },
      ],
    });


    return res.json(reserve)
  }

  async update(req, res) {
    const reserve = await _Reserve2.default.findByPk(req.params.id, {
      include: [
        {
          model: _Event2.default,
          attributes: ['id', 'title', 'category', 'description'],
          include: [
            {
              model: _Image2.default,
              as: 'event_logo',
              attributes: ['id', 'name', 'url'],
            },
            {
              model: _User2.default,
              as: 'users',
              attributes: ['id', 'name'],
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if(!reserve) return res.status(404).json({ error: 'Reserve not found.' })

    const isAdmin = reserve.Event.users.filter(user => user.id == req.userId)
    if(!isAdmin) return res.status(401).json({ error: 'Not authorized.' })

    await reserve.update(req.body)

    return res.json(reserve);
  }

  async delete(req, res) {
    const reserve = await _Reserve2.default.findByPk(req.params.id, {
      include: [
        {
          model: _Event2.default,
          attributes: ['id', 'title', 'category', 'description'],
          include: [
            {
              model: _Image2.default,
              as: 'event_logo',
              attributes: ['id', 'name', 'url'],
            },
            {
              model: _User2.default,
              as: 'users',
              attributes: ['id', 'name'],
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if(!reserve) return res.status(404).json({ error: 'Reserve not found.' })

    const isAdmin = reserve.Event.users.filter(user => user.id == req.userId)
    if(!isAdmin) return res.status(401).json({ error: 'Not authorized.' })

    const dateWithSub = _datefns.subHours.call(void 0, reserve.date, 2);

    if (_datefns.isBefore.call(void 0, dateWithSub, new Date())) {
      return res.status(403).json({ error: 'You can only cancel reserve 2 hours in advance.' });
    }

    reserve.canceled_at = new Date();

    await reserve.save();

    // await Queue.add(CancellationMail.key, { reserve });

    return res.json(reserve);
  }
}

exports. default = new ReserveController();
