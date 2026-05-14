import swaggerJsdoc from "swagger-jsdoc"
import { env } from "./env"

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Elimu Sight API",
      version: "1.0.0",
      description:
        "REST API for Elimu Sight — student analytics, insights, and school management platform",
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/routes/**/*.ts"],
}

export const swaggerSpec = swaggerJsdoc(options)
