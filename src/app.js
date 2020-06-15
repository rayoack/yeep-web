import 'dotenv/config';

import express from 'express';
import path from 'path';
import cors from 'cors';
import * as Sentry from '@sentry/node';
import Youch from 'youch';
import 'express-async-errors';
import io from 'socket.io';
import http from 'http';

import routes from './routes';
import sentryConfig from './config/sentry';

import './database';

class App {
  constructor() {
    this.app = express();
    this.server = http.Server(this.app);

    Sentry.init(sentryConfig);

    this.socket();

    this.middlewares();
    this.routes();
    this.exceptionHandler();

    this.connectedUsers = {};
    this.rooms = []
  }

  socket() {
    this.io = io(this.server);
    this.io.on('connection', socket => {
      const { user_id } = socket.handshake.query;
      this.connectedUsers[user_id] = socket.id;


      // Join a room
      socket.on('joinRoom', ({ roomName }) => {
        let actualRoom = {
          name: roomName,
          users: []
        }

        const roomExists = this.romms.filter(room => room.name == roomName)

        if(roomExists.length) {
          actualRoom = roomExists[0]
        } else {
          this.rooms.push(actualRoom)
        }

        socket.join(roomName)

        actualRoom.users.push(this.connectedUsers[socket.id])

        // Broadcast when a user connects
        // socket.broadcast
        //   .to(user.room)
        //   .emit(
        //     'seeChat',
        //     user
        //   );

        // Send users and room info
        io.to(roomName).emit('usersInRoom', {
          room: roomName,
          users: actualRoom.users
        });
      });

      // Leaves a room
      socket.on('leavesRoom', ({ roomName }) => {
        let actualRoom = {
          name: roomName,
          users: []
        }

        const updatedRooms = this.rooms.map(room => {
          if(room.name == roomName) {
            room.users.filter(user => user != socket.id)

            actualRoom = room
          }

          return room
        })

        this.rooms = updatedRooms

        socket.leave(roomName);

        // Send users and room info
        io.to(roomName).emit('usersInRoom', {
          room: roomName,
          users: actualRoom.users
        });
      });

      socket.on('disconnect', () => {
        delete this.connectedUsers[user_id];
      });
    });
  }

  middlewares() {
    this.app.use(Sentry.Handlers.requestHandler());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
    this.app.use((req, res, next) => {
      req.io = this.io;
      req.connectedUsers = this.connectedUsers;
      next();
    });
  }

  routes() {
    this.app.use(routes);
    this.app.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.app.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const youch = await new Youch(err, req).toJSON();
        return res.status(500).json(youch);
      }

      return res.status(500).json({ error: 'Internal server error.' });
    });
  }
}

export default new App().server;
