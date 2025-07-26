import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        version: "1.0.0",
        title: "Dokumentasi API Acara",
        description: "API documentation for Acara project",
    },
    servers: [
        {
            url: "http://localhost:3000/api",
            description: "Local server",
        },
        {
            url: "https://backend-acara-red.vercel.app/api",
            description: "Production server",
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },
        },
        schemas: {
            LoginRequest: {
                identifier: "rifqinabil",
                password: "12341234",
            }
        },
    },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" }) (outputFile, endpointsFiles, doc);