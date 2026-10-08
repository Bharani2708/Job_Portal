const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { sendStageUpdateEmail, sendNewApplicationRecruiterEmail } = require("../utils/emailService");

const PRIMARY_RECRUITER_EMAIL = "bharanikiruofl139@gmail.com";

const apply = async (req, res) => {
  try {
    const { jobId } = req.body;

    const job = await Job.findById(jobId).populate("recruiter", "name email");
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.recruiter && job.recruiter._id && job.recruiter._id.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot apply to your own job" });
    }

    const existing = await Application.findOne({
      job: jobId,
      applicant: req.user.id
    });

    if (existing) {
      return res.status(409).json({ message: "You already applied for this job" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      status: "Applied",
      timeline: [
        {
          stage: "Applied",
          note: "Application submitted successfully",
          updatedBy: req.user.id,
          timestamp: new Date()
        }
      ]
    });

    // Find the primary recruiter (bharanikiruofl139@gmail.com)
    const primaryRecruiter = await User.findOne({ email: PRIMARY_RECRUITER_EMAIL });

    // 1. Create In-App Notification for Primary Recruiter (bharanikiruofl139@gmail.com)
    if (primaryRecruiter) {
      await Notification.create({
        recipient: primaryRecruiter._id,
        sender: req.user.id,
        title: "New Job Application Received",
        message: `${req.user.name} applied for "${job.title}" at ${job.company}`,
        type: "info",
        link: "/recruiter/applications"
      });
    }

    // 2. Also create In-App Notification for job.recruiter if different from primary recruiter
    if (
      job.recruiter &&
      job.recruiter._id &&
      (!primaryRecruiter || primaryRecruiter._id.toString() !== job.recruiter._id.toString())
    ) {
      await Notification.create({
        recipient: job.recruiter._id,
        sender: req.user.id,
        title: "New Job Application Received",
        message: `${req.user.name} applied for "${job.title}" at ${job.company}`,
        type: "info",
        link: "/recruiter/applications"
      });
    }

    // 3. Create In-App Notification for Applicant
    await Notification.create({
      recipient: req.user.id,
      title: "Application Submitted",
      message: `Your application for "${job.title}" at ${job.company} was submitted successfully.`,
      type: "info",
      link: `/applications?appId=${application._id}`
    });

    // 4. Send Email Notification directly to bharanikiruofl139@gmail.com
    sendNewApplicationRecruiterEmail({
      recruiterEmail: PRIMARY_RECRUITER_EMAIL,
      applicantName: req.user.name,
      applicantEmail: req.user.email,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      appliedAt: new Date()
    }).catch((e) => console.error("Async recruiter application email alert error:", e.message));

    const populated = await application.populate([
      { path: "job", select: "title company location salary jobType" },
      { path: "applicant", select: "name email" }
    ]);

    res.status(201).json(populated);
  } catch (error) {
    console.error("Apply error:", error);
    res.status(500).json({ message: "Application failed" });
  }
};

const myApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate("job", "title company location salary jobType description")
      .populate("timeline.updatedBy", "name role")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Fetch my applications error:", error);
    res.status(500).json({ message: "Could not fetch applications" });
  }
};

const recruiterApplications = async (req, res) => {
  try {
    const isPrimaryRecruiter = req.user.email === PRIMARY_RECRUITER_EMAIL;
    let query = {};

    if (!isPrimaryRecruiter) {
      const jobs = await Job.find({ recruiter: req.user.id }).select("_id");
      const jobIds = jobs.map((job) => job._id);
      query = { job: { $in: jobIds } };
    }

    const applications = await Application.find(query)
      .populate("job", "title company location salary jobType")
      .populate("applicant", "name email")
      .populate("timeline.updatedBy", "name role")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Fetch recruiter applications error:", error);
    res.status(500).json({ message: "Could not fetch applicants" });
  }
};

const updateStage = async (req, res) => {
  try {
    const { stage, note, stageDetails } = req.body;
    const allowedStages = [
      "Applied",
      "Online Assessment",
      "Technical Interview",
      "HR Interview",
      "Offer Released",
      "Accepted",
      "Rejected",
      "Under Review",
      "Shortlisted",
      "Interview",
      "Selected"
    ];

    if (!stage || !allowedStages.includes(stage)) {
      return res.status(400).json({ message: "Invalid hiring stage" });
    }

    const application = await Application.findById(req.params.id)
      .populate("job")
      .populate("applicant", "name email");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const isPrimaryRecruiter = req.user.email === PRIMARY_RECRUITER_EMAIL;
    const isJobOwner = application.job && application.job.recruiter && application.job.recruiter.toString() === req.user.id;

    if (!isJobOwner && !isPrimaryRecruiter) {
      return res.status(403).json({ message: "You are not authorized to manage this application" });
    }

    application.status = stage;

    // Update specific stage details if provided
    if (stageDetails) {
      if (stageDetails.assessment) {
        application.stageDetails.assessment = {
          ...application.stageDetails.assessment,
          ...stageDetails.assessment
        };
      }
      if (stageDetails.technicalInterview) {
        application.stageDetails.technicalInterview = {
          ...application.stageDetails.technicalInterview,
          ...stageDetails.technicalInterview
        };
      }
      if (stageDetails.hrInterview) {
        application.stageDetails.hrInterview = {
          ...application.stageDetails.hrInterview,
          ...stageDetails.hrInterview
        };
      }
      if (stageDetails.offer) {
        application.stageDetails.offer = {
          ...application.stageDetails.offer,
          ...stageDetails.offer,
          releasedAt: stage === "Offer Released" ? new Date() : application.stageDetails.offer?.releasedAt
        };
      }
    }

    // Add to timeline
    application.timeline.push({
      stage,
      note: note || `Application moved to ${stage}`,
      updatedBy: req.user.id,
      timestamp: new Date()
    });

    await application.save();

    // Map notification type
    let notifType = "info";
    if (stage === "Online Assessment") notifType = "assessment";
    else if (stage.includes("Interview")) notifType = "interview";
    else if (stage === "Offer Released") notifType = "offer";
    else if (stage === "Rejected") notifType = "rejected";

    // In-app notification to candidate
    await Notification.create({
      recipient: application.applicant._id,
      sender: req.user.id,
      title: `Application Update: ${stage}`,
      message: `Your application for "${application.job.title}" at ${application.job.company} is now in "${stage}".`,
      type: notifType,
      link: `/applications?appId=${application._id}`
    });

    // Send Email to candidate
    const emailDetails = {};
    if (stage === "Online Assessment" && application.stageDetails.assessment) {
      emailDetails.link = application.stageDetails.assessment.link;
      emailDetails.deadline = application.stageDetails.assessment.deadline;
      emailDetails.instructions = application.stageDetails.assessment.instructions;
    } else if (stage === "Technical Interview" && application.stageDetails.technicalInterview) {
      emailDetails.scheduledAt = application.stageDetails.technicalInterview.scheduledAt;
      emailDetails.meetingLink = application.stageDetails.technicalInterview.meetingLink;
      emailDetails.interviewer = application.stageDetails.technicalInterview.interviewer;
      emailDetails.notes = application.stageDetails.technicalInterview.notes;
    } else if (stage === "HR Interview" && application.stageDetails.hrInterview) {
      emailDetails.scheduledAt = application.stageDetails.hrInterview.scheduledAt;
      emailDetails.meetingLink = application.stageDetails.hrInterview.meetingLink;
      emailDetails.interviewer = application.stageDetails.hrInterview.interviewer;
      emailDetails.notes = application.stageDetails.hrInterview.notes;
    } else if (stage === "Offer Released" && application.stageDetails.offer) {
      emailDetails.ctc = application.stageDetails.offer.ctc;
      emailDetails.joiningDate = application.stageDetails.offer.joiningDate;
      emailDetails.offerLetterNotes = application.stageDetails.offer.offerLetterNotes;
    }

    sendStageUpdateEmail(
      application.applicant.email,
      application.applicant.name,
      application.job.title,
      application.job.company,
      stage,
      emailDetails
    ).catch((err) => console.error("Stage email error:", err));

    const result = await Application.findById(application._id)
      .populate("job", "title company location salary jobType")
      .populate("applicant", "name email")
      .populate("timeline.updatedBy", "name role");

    res.json(result);
  } catch (error) {
    console.error("Update stage error:", error);
    res.status(500).json({ message: "Could not update hiring stage" });
  }
};

const respondOffer = async (req, res) => {
  try {
    const { action, digitalSignature } = req.body; // action: 'accept' or 'decline'

    if (!["accept", "decline"].includes(action)) {
      return res.status(400).json({ message: "Action must be 'accept' or 'decline'" });
    }

    const application = await Application.findOne({
      _id: req.params.id,
      applicant: req.user.id
    }).populate("job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status !== "Offer Released") {
      return res.status(400).json({ message: "Offer is not in released state" });
    }

    if (action === "accept") {
      application.status = "Accepted";
      application.stageDetails.offer.acceptedAt = new Date();
      application.stageDetails.offer.digitalSignature = digitalSignature || req.user.name;

      application.timeline.push({
        stage: "Accepted",
        note: `Offer accepted by candidate. Digital signature: ${digitalSignature || req.user.name}`,
        updatedBy: req.user.id,
        timestamp: new Date()
      });

      // Notify Recruiter
      await Notification.create({
        recipient: application.job.recruiter,
        sender: req.user.id,
        title: "🎉 Job Offer Accepted!",
        message: `${req.user.name} has officially accepted the job offer for "${application.job.title}".`,
        type: "accepted",
        link: "/recruiter/applications"
      });
    } else {
      application.status = "Rejected";
      application.timeline.push({
        stage: "Rejected",
        note: `Offer declined by candidate.`,
        updatedBy: req.user.id,
        timestamp: new Date()
      });

      // Notify Recruiter
      await Notification.create({
        recipient: application.job.recruiter,
        sender: req.user.id,
        title: "Job Offer Declined",
        message: `${req.user.name} has declined the offer for "${application.job.title}".`,
        type: "rejected",
        link: "/recruiter/applications"
      });
    }

    await application.save();

    const result = await Application.findById(application._id)
      .populate("job", "title company location salary jobType")
      .populate("applicant", "name email")
      .populate("timeline.updatedBy", "name role");

    res.json(result);
  } catch (error) {
    console.error("Respond offer error:", error);
    res.status(500).json({ message: "Could not process offer response" });
  }
};

module.exports = {
  apply,
  myApplications,
  recruiterApplications,
  updateStage,
  respondOffer
};
