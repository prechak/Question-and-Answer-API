import express from "express";
import connectionPool from "./utils/db.mjs";
import questionRouter from "./routes/question.mjs";

const app = express();
const port = 7777;

app.use(express.json());
app.use("/questions", questionRouter);

/*
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
*/

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
