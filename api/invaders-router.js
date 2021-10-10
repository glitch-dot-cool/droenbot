const router = require("express").Router();
const cors = require("cors");

const service = require("./services/invaders-service");

router.get("/score", cors(), async (req, res) => {
  const result = await service.get_high_scores();
  res.json(result);
});

router.post("/score", cors(), async (req, res) => {
  try {
    const result = await service.insert_high_score(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
