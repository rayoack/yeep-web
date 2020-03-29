import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';

import {
  UserController,
  SessionController,
  FileController,
  ProviderController,
  AppointmentController,
  ScheduleController,
  NotificationController,
  AvailableController,
  SpaceController,
  EventController, } from './app/controllers/';

const routes = new Router();
const upload = multer(multerConfig);

// Routes without authentication.
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

// Routes with authentication.
routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/schedule', ScheduleController.index);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/avatar', upload.single('file'), FileController.storeAvatar);
routes.post('/images/:id/spaces', upload.array('file'), FileController.spaceImages);
routes.post('/images/:id/events', upload.array('file'), FileController.eventsImages);

routes.get('/spaces', SpaceController.index);
routes.get('/spaces/:id', SpaceController.show);
routes.post('/spaces', SpaceController.store);
routes.put('/spaces/:id', SpaceController.update);
routes.delete('/spaces/:id', SpaceController.delete);

routes.get('/events', EventController.index);
routes.get('/events/:id', EventController.show);
routes.post('/events', EventController.store);
routes.put('/events/:id', EventController.update);
routes.delete('/events/:id', EventController.delete);
routes.post('/events/:id/logo', upload.single('file'), EventController.setEventLogo);

export default routes;
