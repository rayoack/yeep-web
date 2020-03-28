import multer from 'multer';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';
import crypto from 'crypto';
import { extname, resolve } from 'path';

aws.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_S3_REGION
});

const s3 = new aws.S3();

export default {

  storage: multerS3({
    s3: s3,
    bucket: 'yeep-store',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      const filename = `${Date.now()}-${file.originalname.split(' ').join('-')}`;
      cb(null, filename);
    }
  })
};
