import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "My API",
    description: "API documentation",
  },
  host: "localhost:7777",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.mjs"]; // Add more endpoint files as needed

swaggerAutogen()(outputFile, endpointsFiles);
