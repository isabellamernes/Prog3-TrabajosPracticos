import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API de Reservas",
        version: "1.0.0",
        description: "Documentación de la API de reservas con subida de fotos"
      },
      servers: [
        { url: "http://localhost:3000/api/v1", description: "Servidor local" }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      },
      security: [
        { bearerAuth: [] } // aplica a todos los endpoints por defecto
      ]
    },
    apis: ["./src/v1/rutas/*.js"],
  };

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger docs disponibles en /api/docs");
};
