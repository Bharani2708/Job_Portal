const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: [
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
      ],
      default: "Applied"
    },
    stageDetails: {
      assessment: {
        link: { type: String, default: "" },
        deadline: { type: Date },
        platform: { type: String, default: "HackerRank / LeetCode / Unstop" },
        instructions: { type: String, default: "" },
        score: { type: String, default: "" }
      },
      technicalInterview: {
        scheduledAt: { type: Date },
        meetingLink: { type: String, default: "" },
        interviewer: { type: String, default: "" },
        notes: { type: String, default: "" }
      },
      hrInterview: {
        scheduledAt: { type: Date },
        meetingLink: { type: String, default: "" },
        interviewer: { type: String, default: "" },
        notes: { type: String, default: "" }
      },
      offer: {
        ctc: { type: String, default: "" },
        baseSalary: { type: String, default: "" },
        joiningDate: { type: Date },
        perks: [{ type: String }],
        offerLetterNotes: { type: String, default: "" },
        releasedAt: { type: Date },
        acceptedAt: { type: Date },
        digitalSignature: { type: String, default: "" }
      }
    },
    timeline: [
      {
        stage: { type: String, required: true },
        note: { type: String, default: "" },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
