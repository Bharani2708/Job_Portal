const express = require("express");
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  myJobs
} = require("../controllers/jobController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getJobs);
router.get("/mine", protect, allowRoles("recruiter"), myJobs);
router.get("/:id", getJob);

router.post("/", protect, allowRoles("recruiter"), createJob);
router.put("/:id", protect, allowRoles("recruiter"), updateJob);
router.delete("/:id", protect, allowRoles("recruiter"), deleteJob);

module.exports = router;
