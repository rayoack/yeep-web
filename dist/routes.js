"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _multer3 = require('./config/multer'); var _multer4 = _interopRequireDefault(_multer3);

var _auth = require('./app/middlewares/auth'); var _auth2 = _interopRequireDefault(_auth);


















var _ = require('./app/controllers/');

const routes = new (0, _express.Router)();
const upload = _multer2.default.call(void 0, _multer4.default);

// Routes without authentication.
routes.post('/users', _.UserController.store);
routes.post('/sessions', _.SessionController.store);
routes.post('/info', _.PaymentController.info);

// routes.get('/test', PaymentController.test);
// routes.get('/process', PaymentController.process);
// routes.post('/info', PaymentController.info);

routes.use(_auth2.default);

// Routes with authentication.
// USERS
routes.put('/users', _.UserController.update);
routes.get('/users/:id', _.UserController.show);

routes.get('/providers', _.ProviderController.index);
routes.get('/providers/:providerId/available', _.AvailableController.index);

// RESERVES
routes.get('/reserves/:id/:page', _.ReserveController.index);
routes.get('/reserve/:id', _.ReserveController.show);
routes.post('/reserve', _.ReserveController.store);
routes.put('/reserve/:id', _.ReserveController.update);
routes.delete('/reserve/:id', _.ReserveController.delete);

routes.get('/schedule', _.ScheduleController.index);

// NOTIFICATIONS
routes.get('/notifications', _.NotificationController.index);
routes.put('/notifications/:id', _.NotificationController.update);

// IMAGES
routes.post('/avatar', upload.single('file'), _.FileController.storeAvatar);
routes.post('/service/:id/logo', upload.single('file'), _.FileController.setServiceLogo);
routes.post('/images/:id/spaces', upload.array('file'), _.FileController.spaceImages);
routes.post('/images/:id/events', upload.array('file'), _.FileController.eventsImages);
routes.post('/images/:id/service', upload.array('file'), _.FileController.serviceImages);
routes.delete('/images/:id', _.FileController.delete);

// SPACES
routes.get('/spaces/:page', _.SpaceController.index);
routes.get('/space/:id', _.SpaceController.show);
routes.get('/mySpaces/:page', _.SpaceController.mySpaces);
routes.post('/spaces', _.SpaceController.store);
routes.put('/spaces/:id', _.SpaceController.update);
routes.delete('/spaces/:id', _.SpaceController.delete);

// EVENTS
routes.get('/events', _.EventController.index);
routes.get('/events/search/:query', _.EventController.searchEvents);
routes.get('/events/:id', _.EventController.show);
routes.get('/myEvents/:page', _.EventController.myEvents);
routes.post('/events', _.EventController.store);
routes.put('/events/:id', _.EventController.update);
routes.delete('/events/:id', _.EventController.delete);
routes.post('/events/:id/logo', upload.single('file'), _.EventController.setEventLogo);

// MESSAGES
routes.get('/messages/:id', _.MessageController.index)
routes.post('/messages', _.MessageController.store)

// SERVICES
routes.get('/services/:page', _.ServiceController.index);
routes.get('/service/:id', _.ServiceController.show);
routes.get('/myServices/:page', _.ServiceController.myServices);
routes.post('/services', _.ServiceController.store);
routes.put('/services/:id', _.ServiceController.update);
routes.delete('/services/:id', _.ServiceController.delete);

// TICKETS
routes.get('/tickets', _.TicketController.index);
routes.get('/ticket/:id', _.TicketController.show);
routes.post('/ticket', _.TicketController.store);
routes.put('/ticket/:id', _.TicketController.update);
routes.delete('/ticket/:id', _.TicketController.delete);

// PAYMENTS
routes.post('/payments/access-token', _.PaymentController.getAccessToken);
routes.post('/payments/digital-account', _.PaymentController.createDigitalAccount);
routes.get('/payments/check-balance', _.PaymentController.checkBalance);
routes.get('/payments/check-documents/:id', _.PaymentController.checkDocuments);

// ACCOUNTS
routes.get('/accounts', _.AccountController.index);
routes.get('/accounts/:id', _.AccountController.show);
routes.post('/accounts', _.AccountController.store);
routes.put('/accounts/:id', _.AccountController.update);
routes.delete('/accounts/:id', _.AccountController.delete);

// BANKS
routes.get('/bank-accounts/:id', _.BankAccountController.show);
routes.post('/bank-accounts', _.BankAccountController.store);
routes.put('/bank-accounts/:id', _.BankAccountController.update);
routes.delete('/bank-accounts/:id', _.BankAccountController.delete);

exports. default = routes;
