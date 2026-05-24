const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'MediCita Web API',
      version:     '1.0.0',
      description: 'API REST para el sistema de agendamiento de citas médicas',
    },
    servers: [
      { url: 'http://localhost:4000', description: 'Desarrollo' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type:         'http',
          scheme:       'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/modules/**/*.routes.js'],
};

module.exports = swaggerJsdoc(options);
