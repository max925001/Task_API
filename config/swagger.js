// config/swagger.js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0', // Specify OpenAPI version
    info: {
      title: 'Task Management API', // Title of the API
      version: '1.0.0', // Version of the API
      description: 'A simple Task Management API', // Description of the API
    },
    servers: [
      {
        url: 'http://localhost:5000', // URL of the server where the API is hosted
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Specify that we're using JWT tokens
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Apply the security scheme globally to all endpoints
      },
    ],
  },
  apis: ['./routes/*.js'], // Paths to files containing OpenAPI definitions (our route files)
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
