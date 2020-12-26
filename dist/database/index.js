"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _mongoose = require('mongoose'); var _mongoose2 = _interopRequireDefault(_mongoose);

var _database = require('../config/database'); var _database2 = _interopRequireDefault(_database);

var _User = require('../app/models/User'); var _User2 = _interopRequireDefault(_User);
var _Image = require('../app/models/Image'); var _Image2 = _interopRequireDefault(_Image);
var _Reserve = require('../app/models/Reserve'); var _Reserve2 = _interopRequireDefault(_Reserve);
var _Event = require('../app/models/event'); var _Event2 = _interopRequireDefault(_Event);
var _Space = require('../app/models/Space'); var _Space2 = _interopRequireDefault(_Space);
var _Message = require('../app/models/Message'); var _Message2 = _interopRequireDefault(_Message);
var _UsersEvents = require('../app/models/UsersEvents'); var _UsersEvents2 = _interopRequireDefault(_UsersEvents);
var _Service = require('../app/models/Service'); var _Service2 = _interopRequireDefault(_Service);
var _Ticket = require('../app/models/Ticket'); var _Ticket2 = _interopRequireDefault(_Ticket);
var _Notification = require('../app/models/Notification'); var _Notification2 = _interopRequireDefault(_Notification);
var _JunoAccount = require('../app/models/JunoAccount'); var _JunoAccount2 = _interopRequireDefault(_JunoAccount);
var _Account = require('../app/models/Account'); var _Account2 = _interopRequireDefault(_Account);
var _BankAccount = require('../app/models/BankAccount'); var _BankAccount2 = _interopRequireDefault(_BankAccount);
var _JunoToken = require('../app/models/JunoToken'); var _JunoToken2 = _interopRequireDefault(_JunoToken);

const models = [
  _User2.default,
  _Image2.default,
  _Reserve2.default,
  _Event2.default,
  _Space2.default,
  _UsersEvents2.default,
  _Message2.default,
  _Service2.default,
  _Ticket2.default,
  _Notification2.default,
  _Account2.default,
  _JunoAccount2.default,
  _BankAccount2.default,
  _JunoToken2.default
];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new (0, _sequelize2.default)(_database2.default.development);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      process.env.MONGO_URL,
      { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true },
    );
  }
}

exports. default = new Database();
