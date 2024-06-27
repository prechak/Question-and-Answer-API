import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 7777;

app.use(express.json());

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

//ผู้ใช้งานสามารถสร้างคำถามได้
app.post("/questions", async (req, res) => {
  const newQuestion = {
    ...req.body,
  };

  await connectionPool.query(
    `
    insert into questions (title, description, category)
    values($1, $2, $3)
    `,
    [newQuestion.title, newQuestion.description, newQuestion.category]
  );

  return res.status(201).json({
    message: "Created: Question created successfully.",
  });
});

//ผู้ใช้งานสามารถที่จะดูคำถามทั้งหมดได้
app.get("/questions", async (req, res) => {
  let result = await connectionPool.query(`select * from questions`);

  return res.status(200).json({
    data: result.rows,
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
