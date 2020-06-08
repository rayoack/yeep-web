import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import Image from '../app/models/Image';
import Reserve from '../app/models/Reserve';
import Event from '../app/models/Event';
import Space from '../app/models/Space';
import Message from '../app/models/Message';
import UsersEvents from '../app/models/UsersEvents';
import Service from '../app/models/Service';
import Ticket from '../app/models/Ticket';
import ReceiverAccount from '../app/models/ReceiverAccount';

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
  ReceiverAccount
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
