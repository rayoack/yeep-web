"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _datefns = require('date-fns');
var _sequelize = require('sequelize');

var _Reserve = require('../models/Reserve'); var _Reserve2 = _interopRequireDefault(_Reserve);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);

class ScheduleController {
  async index(req, res) {
    /**
     * Check if user is a provider.
     */
    const checkUserProvider = await _User2.default.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res.status(422).json({ error: 'User is not a provider.' });
    }

    /**
     * List appointments betwenn start and end of day.
     */
    const { date } = req.query;
    const parsedDate = _datefns.parseISO.call(void 0, date);

    const appointments = await _Reserve2.default.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [_sequelize.Op.between]: [_datefns.startOfDay.call(void 0, parsedDate), _datefns.endOfDay.call(void 0, parsedDate)],
        },
      },
      include: [
        {
          model: _User2.default,
          as: 'user',
          attributes: ['id', 'name'],
        },
      ],
      order: ['date'],
    });

    return res.json(appointments);
  }
}

exports. default = new ScheduleController();
