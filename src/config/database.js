require('dotenv/config');

module.exports = {
  development: {
    username: process.env.DB_USER_DEV,
    password: process.env.DB_PASS_DEV,
    database: process.env.DB_NAME_DEV,
    host: process.env.DB_HOST_DEV,
    dialect: 'mysql',
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
  },
  production: {
    username: process.env.DB_USER_PROD,
    password: process.env.DB_PASS_PROD,
    database: process.env.DB_NAME_PROD,
    host: process.env.DB_HOST_PROD,
    dialect: 'mysql',
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
  },
};
