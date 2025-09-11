require('dotenv').config();  // Load .env đầu tiên

const port = process.env.PORT || 3000;

const SERVER_URL = process.env.NODE_ENV === 'production'
  ? process.env.SERVER_URL   // set trong Render Environment Variables
  : `http://localhost:${port}`;

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Game The Bai Team 3 API',
      version: '1.0.0',
      description: 'API documentation for Game The Bai Team 3',
    },
    servers: [
      { url: SERVER_URL },  // Dùng đúng URL deploy hoặc localhost
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Nhập JWT token để authorize các API protected',
        },
      },
    },
    security: [
      { BearerAuth: [] },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
