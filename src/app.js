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
    this.rooms = {}
  }

  socket() {
    this.io = io(this.server);
    this.io.on('connection', socket => {
      const { user_id } = socket.handshake.query;
      this.connectedUsers[user_id] = socket.id;

      // Join a room
      socket.on('joinRoom', roomName => {
        socket.join(roomName)
      });

      // Leaves a room
      socket.on('leavesRoom', roomName => {
        socket.leave(roomName);
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
