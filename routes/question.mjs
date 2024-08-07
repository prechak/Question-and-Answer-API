import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import validationCreateQuestion from "../middlewares/post.validation.mjs";
import validationUpdateQuestion from "../middlewares/put.validation.mjs";
import validationCreateAnswer from "../middlewares/postanswers.validation.mjs";

const questionRouter = Router();

questionRouter.post("/", [validationCreateQuestion], async (req, res) => {
  const newQuestion = {
    ...req.body,
  };

  try {
    await connectionPool.query(
      `
    insert into questions (title, description, category)
    values($1, $2, $3)
    `,
      [newQuestion.title, newQuestion.description, newQuestion.category]
    );
  } catch {
    return res.status(400).json({
      message: "Missing or invalid request data",
    });
  }

  return res.status(201).json({
    message: "Created: Question created successfully.",
  });
});

questionRouter.post(
  "/:id/answers",
  [validationCreateAnswer],
  async (req, res) => {
    let questionId = req.params.id;
    let answer = { ...req.body };

    try {
      await connectionPool.query(
        `insert into answers(question_id, content)
  values($1, $2)
  returning *
  `,
        [questionId, answer.content]
      );
    } catch {
      return res.status(400).json({
        message: `Missing or invalid request data`,
      });
    }

    return res.status(201).json({
      message: "Answer created successfully",
    });
  }
);

questionRouter.post("/:id/upvote", async (req, res) => {
  let questionId = req.params.id;
  let newVote = { ...req.body };
  let checkQuestion;
  let result;

  try {
    if (!Number(newVote.vote) || newVote.vote !== 1) {
      return res.status(400).json({
        message: `Vote must be number and value must be 1`,
      });
    }
    checkQuestion = await connectionPool.query(
      `select * from questions where id = $1`,
      [questionId]
    );

    if (!checkQuestion.rows[0]) {
      return res.status(404).json({
        message: `Question not found.`,
      });
    }

    result = await connectionPool.query(
      `insert into question_votes (question_id, vote)
    values($1, $2) returning *`,
      [questionId, newVote.vote]
    );
  } catch {
    return res.status(400).json({
      message: `Missing or invalid request data`,
    });
  }

  return res.status(200).json({
    // data: result.rows[0],
    message: `Successfully upvoted the question.`,
  });
});

questionRouter.post("/:id/downvote", async (req, res) => {
  let questionId = req.params.id;
  let newVote = { ...req.body };
  let checkQuestion;
  let result;

  try {
    if (!Number(newVote.vote) || newVote.vote !== -1) {
      return res.status(400).json({
        message: `Vote must be number and value must be -1`,
      });
    }
    checkQuestion = await connectionPool.query(
      `select * from questions where id = $1`,
      [questionId]
    );

    if (!checkQuestion.rows[0]) {
      return res.status(404).json({
        message: `Question not found.`,
      });
    }

    result = await connectionPool.query(
      `insert into question_votes (question_id, vote)
    values($1, $2) returning *`,
      [questionId, newVote.vote]
    );
  } catch {
    return res.status(400).json({
      message: `Missing or invalid request data`,
    });
  }

  return res.status(200).json({
    // data: result.rows[0],
    message: `Successfully upvoted the question.`,
  });
});

questionRouter.get("/", async (req, res) => {
  let result;
  let keywords = req.query.keywords;
  console.log("Received keywords:", keywords);

  if (keywords === undefined) {
    return res.status(400).json({
      message: "Please send keywords parameter in the URL endpoint",
    });
  }

  try {
    result = await connectionPool.query(`select * from questions`);
  } catch {
    return res.status(400).json({
      message: "Missing or invalid request data",
    });
  }

  const regexKeywords = keywords.split(" ").join("|");
  const regex = new RegExp(regexKeywords, "ig");

  const filteredResults = result.rows.filter((question) => {
    return (
      question.title.match(regex) ||
      question.description.match(regex) ||
      (question.category && question.category.match(regex))
    );
  });

  return res.status(201).json({
    data: filteredResults,
  });
});

questionRouter.get("/:id", async (req, res) => {
  const questionIdFromClient = req.params.id;

  let result;
  try {
    result = await connectionPool.query(
      `select * from questions where id = $1`,
      [questionIdFromClient]
    );
  } catch {
    return res.status(400).json({
      message: "Missing or invalid request data",
    });
  }

  if (!result.rows[0]) {
    return res.status(404).json({
      message: "Question not found",
    });
  }

  return res.status(201).json({
    data: result.rows[0],
  });
});

questionRouter.get("/:id/answers", async (req, res) => {
  const questionId = req.params.id;
  let result;

  try {
    result = await connectionPool.query(
      `select * from answers where question_id = $1`,
      [questionId]
    );
  } catch {
    return res.status(400).json({
      message: `Missing or invalid request data`,
    });
  }
  if (!result.rows[0]) {
    return res.status(404).json({
      message: `Question not found`,
    });
  }

  return res.status(200).json({
    data: result.rows,
    message: `Successfully retrieved the answers.`,
  });
});

questionRouter.put("/:id", [validationUpdateQuestion], async (req, res) => {
  const questionIdFromClient = req.params.id;
  const updateQuestion = { ...req.body };

  let result;
  try {
    result = await connectionPool.query(
      `
    update questions 
    set title = $2,
        description = $3,
        category = $4
    where id = $1
    returning *
    `,
      [
        questionIdFromClient,
        updateQuestion.title,
        updateQuestion.description,
        updateQuestion.category,
      ]
    );
  } catch {
    return res.status(400).json({ message: "Missing or invalid request data" });
  }

  if (!result.rows[0]) {
    return res.status(404).json({
      message: "Question not found",
    });
  }

  return res.status(201).json({
    message: "Successfully updated the question.",
  });
});

questionRouter.delete("/:id", async (req, res) => {
  const questionIdFromClient = req.params.id;
  let result;

  try {
    result = await connectionPool.query(
      `delete from questions where id = $1 returning *`,
      [questionIdFromClient]
    );
  } catch {
    return res.status(400).json({
      message: "Missing or invalid request data",
    });
  }

  if (!result.rows[0]) {
    return res.status(404).json({
      message: `Question not found (question id: ${questionIdFromClient})`,
    });
  }

  return res.status(201).json({
    message: `Question and its answers deleted successfully.`,
  });
});

export default questionRouter;
