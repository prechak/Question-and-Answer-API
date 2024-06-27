const validationUpdateQuestion = (req, res, next) => {
  if (!req.body.title) {
    return res.status(401).json({
      message: "Missing title or invalid title",
    });
  }

  if (!req.body.description) {
    return res.status(401).json({
      message: "Missing title or invalid content",
    });
  }

  if (!req.body.category) {
    return res.status(401).json({
      message: "Missing title or invalid category",
    });
  }

  next();
};

export default validationUpdateQuestion;
