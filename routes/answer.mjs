import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const answerRouter = Router();

answerRouter.post("/:id/upvote", async (req, res) => {
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

answerRouter.post("/:id/downvote", async (req, res) => {
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

export default answerRouter;
