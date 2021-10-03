const router = require("express").Router();
const service = require("./services/invaders-service");

router.get("/score", async (req, res) => {
  const result = await service.get_high_scores();
  res.json(result);
});

router.post("/score", async (req, res) => {
  const result = await service.insert_high_score(req.body);
  res.json(result);
});

module.exports = router;
