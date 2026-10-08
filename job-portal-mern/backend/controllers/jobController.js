const Job = require("../models/Job");

const PRIMARY_RECRUITER_EMAIL = "bharanikiruofl139@gmail.com";

const createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary, skills, experience, jobType } = req.body;

    if (!title || !description || !company || !location) {
      return res.status(400).json({ message: "Title, description, company and location are required" });
    }

    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      skills: Array.isArray(skills)
        ? skills
        : String(skills || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
      experience,
      jobType,
      recruiter: req.user.id
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Could not create job" });
  }
};

const getJobs = async (req, res) => {
  try {
    const { search, location, jobType } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } }
      ];
    }

    if (location) filter.location = { $regex: location, $options: "i" };
    if (jobType) filter.jobType = jobType;

    const jobs = await Job.find(filter)
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch jobs" });
  }
};

const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("recruiter", "name email");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch job" });
  }
};

const updateJob = async (req, res) => {
  try {
    const isPrimaryRecruiter = req.user.email === PRIMARY_RECRUITER_EMAIL;
    const query = isPrimaryRecruiter ? { _id: req.params.id } : { _id: req.params.id, recruiter: req.user.id };

    const job = await Job.findOne(query);
    if (!job) return res.status(404).json({ message: "Job not found or not owned by you" });

    const allowed = ["title", "description", "company", "location", "salary", "skills", "experience", "jobType"];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) job[field] = req.body[field];
    });

    if (typeof job.skills === "string") {
      job.skills = job.skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Could not update job" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const isPrimaryRecruiter = req.user.email === PRIMARY_RECRUITER_EMAIL;
    const query = isPrimaryRecruiter ? { _id: req.params.id } : { _id: req.params.id, recruiter: req.user.id };

    const job = await Job.findOneAndDelete(query);

    if (!job) return res.status(404).json({ message: "Job not found or not owned by you" });

    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete job" });
  }
};

const myJobs = async (req, res) => {
  try {
    const isPrimaryRecruiter = req.user.email === PRIMARY_RECRUITER_EMAIL;
    const query = isPrimaryRecruiter ? {} : { recruiter: req.user.id };

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch your jobs" });
  }
};

module.exports = { createJob, getJobs, getJob, updateJob, deleteJob, myJobs };
