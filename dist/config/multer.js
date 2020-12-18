"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _awssdk = require('aws-sdk'); var _awssdk2 = _interopRequireDefault(_awssdk);
var _multers3 = require('multer-s3'); var _multers32 = _interopRequireDefault(_multers3);
var _crypto = require('crypto'); var _crypto2 = _interopRequireDefault(_crypto);
var _path = require('path');

_awssdk2.default.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_S3_REGION
});

const s3 = new _awssdk2.default.S3();

exports. default = {

  storage: _multers32.default.call(void 0, {
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET ? process.env.AWS_S3_BUCKET : 'klub-store-dev',
    contentType: _multers32.default.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      const filename = `${Date.now()}-${file.originalname.split(' ').join('-')}`;
      cb(null, filename);
    }
  })
};
