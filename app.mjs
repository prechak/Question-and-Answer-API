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

//ผู้ใช้งานสามารถกดปุ่มเห็นด้วย หรือไม่เห็นด้วยกับคำตอบได้ - Answer Upvote
app.post("/answers/:id/upvote", async (req, res) => {
  const answerId = req.params.id;
  let newVote = { ...req.body };
  let checkAnswer;
  let result;

  try {
    if (!Number(newVote.vote) || newVote.vote !== 1) {
      return res.status(400).json({
        message: `Vote must be number and value must be 1`,
      });
    }
    checkAnswer = await connectionPool.query(
      `select * from answers where id = $1`,
      [answerId]
    );

    if (!checkAnswer.rows[0]) {
      return res.status(404).json({
        message: `Answer not found.`,
      });
    }

    result = await connectionPool.query(
      `insert into answer_votes (answer_id, vote)
    values($1, $2) returning *`,
      [answerId, newVote.vote]
    );
  } catch {
    return res.status(400).json({
      message: `Missing or invalid request data`,
    });
  }

  return res.status(200).json({
    data: checkAnswer.rows,
    message: `Successfully upvoted the answers.`,
  });
});

//ผู้ใช้งานสามารถกดปุ่มเห็นด้วย หรือไม่เห็นด้วยกับคำตอบได้ - Answer Downvote
app.post("/answers/:id/downvote", async (req, res) => {
  const answerId = req.params.id;
  let newVote = { ...req.body };
  let checkAnswer;
  let result;

  try {
    if (!Number(newVote.vote) || newVote.vote !== -1) {
      return res.status(400).json({
        message: `Vote must be number and value must be -1`,
      });
    }
    checkAnswer = await connectionPool.query(
      `select * from answers where id = $1`,
      [answerId]
    );

    if (!checkAnswer.rows[0]) {
      return res.status(404).json({
        message: `Answer not found.`,
      });
    }

    result = await connectionPool.query(
      `insert into answer_votes (answer_id, vote)
    values($1, $2) returning *`,
      [answerId, newVote.vote]
    );
  } catch {
    return res.status(400).json({
      message: `Missing or invalid request data`,
    });
  }

  return res.status(200).json({
    data: checkAnswer.rows,
    message: `Successfully upvoted the answers.`,
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
