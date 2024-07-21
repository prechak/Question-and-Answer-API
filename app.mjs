import express from "express";

import questionRouter from "./routes/question.mjs";
import answerRouter from "./routes/answer.mjs";

import swaggerUi from "swagger-ui-express";
import { loadSwaggerDocument } from "./utils/swagger.mjs";

const app = express();
const port = 7777;

app.use(express.json());
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(loadSwaggerDocument()));

async function setupSwagger() {
  const swaggerDocument = await loadSwaggerDocument();
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

setupSwagger();

app.use("/questions", questionRouter);
app.use("/answers", answerRouter);

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

//db connection test
app.get("/dbtest", async (req, res) => {
  let result = await connectionPool.query(`select * from questions`);

  return res.status(200).json({
    message: "Database is connected 🐘",
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
