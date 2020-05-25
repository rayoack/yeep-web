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
// import Notification from '../schemas/Notification';

var _Queue = require('../../lib/Queue'); var _Queue2 = _interopRequireDefault(_Queue);
var _CancellationMail = require('../jobs/CancellationMail'); var _CancellationMail2 = _interopRequireDefault(_CancellationMail);

class ReserveController {

  async index(req, res) {
    const { page } = req.params;
    let reserves = []

    if(req.body.request_type == 'space') {
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
    } else if (req.body.request_type == 'event') {

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
              'category'
            ],
            include: {
              model: _Image2.default,
              attributes: ['id', 'name', 'url'],
            },
          },
        ],
      });

    } else if (req.body.request_type == 'service') {

      reserves = await _Reserve2.default.findAll({
        where: { service_id: req.params.id, canceled_at: null },
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
      event_id: Yup.number(),
      service_id: Yup.number(),
      message: Yup.string(),
      amount: Yup.number().required(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    let { space_id, service_id, dates, amount, event_id, message, status } = req.body;

    let space = {}
    let service = {}

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

    // SERVICE RESERVE ----
    if(service_id != null) {
      service = await _Service2.default.findOne({ where: { id: service_id } });

      if (!service) {
        return res.status(422).json({ error: "Space not found" });
      }

      /**
       * Check if service_id is the current user.
       */
      if (service.user_id === req.userId) {
        return res.status(422).json({ error: "You can't create a schedule for yourself." });
      }
    }

    /**
     * Check for past dates.
     */
    const hourStart = _datefns.startOfHour.call(void 0, _datefns.parseISO.call(void 0, dates[0].full_date));

    if (_datefns.isBefore.call(void 0, hourStart, new Date())) {
      return res.status(422).json({ error: 'Past dates are not permitted.' });
    }

    /**
     * Create reserve.
     */
    const {id: reserve_id} = await _Reserve2.default.create({
      space_id,
      service_id,
      event_id,
      message,
      amount,
      dates,
      status,
      ...req.body
    });

    /**
     * Notify appointment provider.
     */
    const user = await _User2.default.findByPk(req.userId);
    const formattedDate = _datefns.format.call(void 0, 
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: _ptBR2.default },
    );

    // const notification = await Notification.create({
    //   user:  space_id ?
    //     space.owner_id
    //     : service.user_id,
    //   target_id: reserve_id,
    //   content: `Nova reserva de ${ user.name } para ${ formattedDate }`,
    // });

    // Create first message.
    if(message == null) {
      message = `Nova reserva de ${ user.name } para ${ formattedDate }`
    }

    const newMessage = await _Message2.default.create({
      message,
      room_id: reserve_id,
      sender_id: req.userId,
      receiver_id: space_id ?
        space.owner_id
        : service.user_id,
    })

    // const ownerSocket = req.connectedUsers[notification.user];

    // if (ownerSocket) {
    //   req.io.to(ownerSocket).emit('notification', notification);
    // }

    return res.json({
      reserve_id,
      space_id,
      service_id,
      event_id,
      message,
      amount,
      dates,
      status,
      ...req.body
    });
  }

  async show(req, res) {
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
