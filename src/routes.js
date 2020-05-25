import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';

import {
  UserController,
  SessionController,
  FileController,
  ProviderController,
  ReserveController,
  ScheduleController,
  // NotificationController,
  AvailableController,
  SpaceController,
  EventController,
  MessageController,
  ServiceController,
  TicketController
} from './app/controllers/';

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

routes.get('/reserves/:id/:page', ReserveController.index);
routes.get('/reserve/:id', ReserveController.show);
routes.post('/reserve', ReserveController.store);
routes.put('/reserve/:id', ReserveController.update);
routes.delete('/reserve/:id', ReserveController.delete);

routes.get('/schedule', ScheduleController.index);

// routes.get('/notifications', NotificationController.index);
// routes.put('/notifications/:id', NotificationController.update);

routes.post('/avatar', upload.single('file'), FileController.storeAvatar);
routes.post('/service/:id/logo', upload.single('file'), FileController.setServiceLogo);
routes.post('/images/:id/spaces', upload.array('file'), FileController.spaceImages);
routes.post('/images/:id/events', upload.array('file'), FileController.eventsImages);
routes.post('/images/:id/service', upload.array('file'), FileController.serviceImages);
routes.delete('/images/:id', FileController.delete);

routes.get('/spaces/:page', SpaceController.index);
routes.get('/space/:id', SpaceController.show);
routes.get('/mySpaces/:page', SpaceController.mySpaces);
routes.post('/spaces', SpaceController.store);
routes.put('/spaces/:id', SpaceController.update);
routes.delete('/spaces/:id', SpaceController.delete);

routes.get('/events', EventController.index);
routes.get('/events/search/:query', EventController.searchEvents);
routes.get('/events/:id', EventController.show);
routes.get('/myEvents/:page', EventController.myEvents);
routes.post('/events', EventController.store);
routes.put('/events/:id', EventController.update);
routes.delete('/events/:id', EventController.delete);
routes.post('/events/:id/logo', upload.single('file'), EventController.setEventLogo);

routes.get('/messages/:id', MessageController.index)
routes.post('/messages', MessageController.store)

routes.get('/services/:page', ServiceController.index);
routes.get('/service/:id', ServiceController.show);
routes.get('/myServices/:page', ServiceController.myServices);
routes.post('/services', ServiceController.store);
routes.put('/services/:id', ServiceController.update);
routes.delete('/services/:id', ServiceController.delete);

routes.get('/tickets', TicketController.index);
routes.get('/ticket/:id', TicketController.show);
routes.post('/ticket', TicketController.store);
routes.put('/ticket/:id', TicketController.update);
routes.delete('/ticket/:id', TicketController.delete);

export default routes;
