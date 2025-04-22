// server/swagger.js
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Book API",
            version: "1.0.0",
            description: "A simple API to manage a book collection",
        },
        servers: [
            {
                url: "http://localhost:4003",
            },
        ],
    },
    apis: ["./book-route/*.mjs"],
};

const specs = swaggerJSDoc(swaggerOptions);

export function setupSwagger(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}

