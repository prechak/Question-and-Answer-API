import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import validationCreateQuestion from "../middlewares/post.validation.mjs";
import validationUpdateQuestion from "../middlewares/put.validation.mjs";

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

//ผู้ใช้งานสามารถที่จะดูคำถามทั้งหมดได้
questionRouter.get("/", async (req, res) => {
  let result;
  try {
    result = await connectionPool.query(`select * from questions`);
  } catch {
    return res.status(400).json({
      message: "Missing or invalid request data",
    });
  }

  return res.status(200).json({
    data: result.rows,
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
