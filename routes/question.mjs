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
    // console.log(answer);

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

//ผู้ใช้งานสามารถที่จะดูคำถามทั้งหมดได้
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

//ผู้ใช้งานสามารถที่จะดูคำถามแต่ละอันได้ ด้วย Id ของคำถามได้
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

questionRouter.get("/:id/answers", async (req, res) => {}); // todo next

//ผู้ใช้งานสามารถที่จะแก้ไขหัวข้อ หรือคำอธิบายของคำถามได้
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

//ผู้ใช้งานสามารถที่จะลบคำถามได้
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
    message: `Successfully deleted the question`,
  });
});

export default questionRouter;
