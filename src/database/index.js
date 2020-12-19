import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import Image from '../app/models/Image';
import Reserve from '../app/models/Reserve';
import Event from '../app/models/event';
import Space from '../app/models/Space';
import Message from '../app/models/Message';
import UsersEvents from '../app/models/UsersEvents';
import Service from '../app/models/Service';
import Ticket from '../app/models/Ticket';
import Notification from '../app/models/Notification';
import JunoAccount from '../app/models/JunoAccount';
import Account from '../app/models/Account';
import BankAccount from '../app/models/BankAccount';
import JunoToken from '../app/models/JunoToken';

const models = [
  User,
  Image,
  Reserve,
  Event,
  Space,
  UsersEvents,
  Message,
  Service,
  Ticket,
  Notification,
  Account,
  JunoAccount,
  BankAccount,
  JunoToken
];

class Database {
  constructor() {
    this.init();
    // this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig.development);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  // mongo() {
  //   this.mongoConnection = mongoose.connect(
  //     process.env.MONGO_URL,
  //     { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true },
  //   );
  // }
}

export default new Database();
