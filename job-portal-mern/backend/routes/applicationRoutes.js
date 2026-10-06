const express = require("express");
const {
  apply,
  myApplications,
  recruiterApplications,
  updateStage,
  respondOffer
} = require("../controllers/applicationController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, allowRoles("jobseeker"), apply);
router.get("/mine", protect, allowRoles("jobseeker"), myApplications);
router.get("/recruiter", protect, allowRoles("recruiter"), recruiterApplications);
router.patch("/:id/stage", protect, allowRoles("recruiter"), updateStage);
router.patch("/:id/status", protect, allowRoles("recruiter"), updateStage); // backward compatibility
router.patch("/:id/respond-offer", protect, allowRoles("jobseeker"), respondOffer);

module.exports = router;
