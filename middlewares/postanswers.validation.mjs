const validationCreateAnswer = (req, res, next) => {
  if (!req.body.content || req.body.content.length > 300) {
    return res.status(400).json({
      message:
        "Answer content is required and should not exceed 300 characters.",
    });
  }

  next();
};

export default validationCreateAnswer;
