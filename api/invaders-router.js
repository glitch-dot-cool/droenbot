const router = require("express").Router();
const cors = require("cors");

const service = require("./services/invaders-service");

router.options("/score", cors()); // enable pre-flight request for POST

router.get("/score", cors(), async (req, res) => {
  try {
    const result = await service.get_high_scores();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.post("/score", cors({ methods: ["POST"] }), async (req, res) => {
  try {
    const result = await service.insert_high_score(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json(error);
  }
});

// router.delete("/scores", async (req, res) => {
//   await service._delete_all_scores();
//   res.send("nuked everything, hope you did that intentionally.");
// });

module.exports = router;
