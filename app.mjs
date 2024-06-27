import express from "express";
import connectionPool from "./utils/db.mjs";
import questionRouter from "./routes/question.mjs";
import validationCreateQuestion from "./middlewares/post.validation.mjs";
import validationUpdateQuestion from "./middlewares/put.validation.mjs";

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

//ผู้ใช้งานสามารถสร้างคำถามได้
// app.post("/questions", [validationCreateQuestion], async (req, res) => {
//   const newQuestion = {
//     ...req.body,
//   };

//   try {
//     await connectionPool.query(
//       `
//     insert into questions (title, description, category)
//     values($1, $2, $3)
//     `,
//       [newQuestion.title, newQuestion.description, newQuestion.category]
//     );
//   } catch {
//     return res.status(400).json({
//       message: "Missing or invalid request data",
//     });
//   }

//   return res.status(201).json({
//     message: "Created: Question created successfully.",
//   });
// });

// //ผู้ใช้งานสามารถที่จะดูคำถามทั้งหมดได้
// app.get("/questions", async (req, res) => {
//   let result;
//   try {
//     result = await connectionPool.query(`select * from questions`);
//   } catch {
//     return res.status(400).json({
//       message: "Missing or invalid request data",
//     });
//   }

//   return res.status(200).json({
//     data: result.rows,
//   });
// });

// //ผู้ใช้งานสามารถที่จะดูคำถามแต่ละอันได้ ด้วย Id ของคำถามได้
// app.get("/questions/:id", async (req, res) => {
//   const questionIdFromClient = req.params.id;

//   let result;
//   try {
//     result = await connectionPool.query(
//       `select * from questions where id = $1`,
//       [questionIdFromClient]
//     );
//   } catch {
//     return res.status(400).json({
//       message: "Missing or invalid request data",
//     });
//   }

//   if (!result.rows[0]) {
//     return res.status(404).json({
//       message: "Question not found",
//     });
//   }

//   return res.status(201).json({
//     data: result.rows[0],
//   });
// });

// //ผู้ใช้งานสามารถที่จะแก้ไขหัวข้อ หรือคำอธิบายของคำถามได้
// app.put("/questions/:id", [validationUpdateQuestion], async (req, res) => {
//   const questionIdFromClient = req.params.id;
//   const updateQuestion = { ...req.body };

//   let result;
//   try {
//     result = await connectionPool.query(
//       `
//     update questions
//     set title = $2,
//         description = $3,
//         category = $4
//     where id = $1
//     returning *
//     `,
//       [
//         questionIdFromClient,
//         updateQuestion.title,
//         updateQuestion.description,
//         updateQuestion.category,
//       ]
//     );
//   } catch {
//     return res.status(400).json({ message: "Missing or invalid request data" });
//   }

//   if (!result.rows[0]) {
//     return res.status(404).json({
//       message: "Question not found",
//     });
//   }

//   return res.status(201).json({
//     message: "Successfully updated the question.",
//   });
// });

// //ผู้ใช้งานสามารถที่จะลบคำถามได้
// app.delete("/questions/:id", async (req, res) => {
//   const questionIdFromClient = req.params.id;
//   let result;

//   try {
//     result = await connectionPool.query(
//       `delete from questions where id = $1 returning *`,
//       [questionIdFromClient]
//     );
//   } catch {
//     return res.status(400).json({
//       message: "Missing or invalid request data",
//     });
//   }

//   if (!result.rows[0]) {
//     return res.status(404).json({
//       message: `Question not found (question id: ${questionIdFromClient})`,
//     });
//   }

//   return res.status(201).json({
//     message: `Successfully deleted the question`,
//   });
// });

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
