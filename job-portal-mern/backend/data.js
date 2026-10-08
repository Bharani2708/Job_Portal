const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Job = require("./models/Job");
const Application = require("./models/Application");
const Notification = require("./models/Notification");

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jobconnect";
    console.log(`🔌 Connecting to MongoDB: ${mongoUri.replace(/:([^:@]{4})[^:@]*@/, ":****@")}`);
    
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully\n");

    console.log("🧹 Cleaning existing dataset...");
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Notification.deleteMany({});
    // Delete existing demo seed users to avoid duplicate key errors
    await User.deleteMany({
      email: {
        $in: [
          "recruiter@google.com",
          "recruiter@flipkart.com",
          "recruiter@zoho.com",
          "recruiter@razorpay.com",
          "recruiter@swiggy.com",
          "seeker.rahul@gmail.com",
          "seeker.priya@gmail.com",
          "seeker.amit@gmail.com",
          "seeker.sneha@gmail.com"
        ]
      }
    });

    console.log("👥 Creating verified Recruiter & Job Seeker accounts...");
    const defaultPassword = await bcrypt.hash("Password@123", 10);

    // 1. Create Recruiters
    const recruiters = await User.create([
      {
        name: "Vikram Malhotra",
        email: "recruiter@google.com",
        password: defaultPassword,
        role: "recruiter",
        isVerified: true
      },
      {
        name: "Ananya Deshmukh",
        email: "recruiter@flipkart.com",
        password: defaultPassword,
        role: "recruiter",
        isVerified: true
      },
      {
        name: "Karthik Subramanian",
        email: "recruiter@zoho.com",
        password: defaultPassword,
        role: "recruiter",
        isVerified: true
      },
      {
        name: "Rohan Varma",
        email: "recruiter@razorpay.com",
        password: defaultPassword,
        role: "recruiter",
        isVerified: true
      },
      {
        name: "Meera Sen",
        email: "recruiter@swiggy.com",
        password: defaultPassword,
        role: "recruiter",
        isVerified: true
      }
    ]);

    // 2. Create Job Seekers
    const seekers = await User.create([
      {
        name: "Rahul Sharma",
        email: "seeker.rahul@gmail.com",
        password: defaultPassword,
        role: "jobseeker",
        isVerified: true
      },
      {
        name: "Priya Nair",
        email: "seeker.priya@gmail.com",
        password: defaultPassword,
        role: "jobseeker",
        isVerified: true
      },
      {
        name: "Amit Patel",
        email: "seeker.amit@gmail.com",
        password: defaultPassword,
        role: "jobseeker",
        isVerified: true
      },
      {
        name: "Sneha Reddy",
        email: "seeker.sneha@gmail.com",
        password: defaultPassword,
        role: "jobseeker",
        isVerified: true
      }
    ]);

    console.log(`✅ Created ${recruiters.length} Recruiters and ${seekers.length} Job Seekers.\n`);

    // 3. Create Tech Jobs
    console.log("💼 Seeding Indian Tech Jobs with Rupee (₹ LPA) compensation...");

    const jobsData = [
      {
        title: "Senior Full Stack Engineer (MERN)",
        company: "Google India",
        location: "Bangalore, Karnataka",
        salary: "₹28 - ₹42 LPA",
        experience: "3-6 Years",
        jobType: "Full-time",
        skills: ["React", "Node.js", "TypeScript", "MongoDB", "System Design", "Docker"],
        description: "Join Google's core Cloud platforms team to architect high-throughput web systems, resilient microservices, and modern React interfaces serving millions of enterprise customers globally.",
        recruiter: recruiters[0]._id
      },
      {
        title: "Frontend Architect (React / Next.js)",
        company: "Google India",
        location: "Hyderabad, Telangana",
        salary: "₹32 - ₹48 LPA",
        experience: "5-8 Years",
        jobType: "Full-time",
        skills: ["React", "Next.js", "Web Performance", "State Management", "Tailwind CSS"],
        description: "Lead UI architectural decisions, optimize Core Web Vitals, and build accessible, responsive components for Google Workspace cloud applications.",
        recruiter: recruiters[0]._id
      },
      {
        title: "Backend Platform Engineer",
        company: "Flipkart",
        location: "Bangalore, Karnataka",
        salary: "₹20 - ₹34 LPA",
        experience: "2-5 Years",
        jobType: "Full-time",
        skills: ["Node.js", "Express.js", "Redis", "Kafka", "MongoDB", "Microservices"],
        description: "Help build the backbone of India's largest e-commerce supply chain platform, handling Big Billion Day peak traffic with sub-50ms latency.",
        recruiter: recruiters[1]._id
      },
      {
        title: "Lead React Native Developer",
        company: "Flipkart",
        location: "Bangalore, Karnataka",
        salary: "₹24 - ₹36 LPA",
        experience: "4-7 Years",
        jobType: "Full-time",
        skills: ["React Native", "TypeScript", "Redux Toolkit", "iOS", "Android"],
        description: "Design and scale the consumer Flipkart mobile application used by over 100 million active Indian shoppers every month.",
        recruiter: recruiters[1]._id
      },
      {
        title: "SaaS Product Engineer (MERN)",
        company: "Zoho Corporation",
        location: "Chennai, Tamil Nadu",
        salary: "₹12 - ₹20 LPA",
        experience: "1-4 Years",
        jobType: "Full-time",
        skills: ["React", "Node.js", "Express.js", "MongoDB", "REST APIs"],
        description: "Join Zoho's product engineering team to build enterprise CRM and collaboration tools from our state-of-the-art Chennai development campus.",
        recruiter: recruiters[2]._id
      },
      {
        title: "UI/UX Front-End Specialist",
        company: "Zoho Corporation",
        location: "Chennai, Tamil Nadu",
        salary: "₹10 - ₹16 LPA",
        experience: "1-3 Years",
        jobType: "Full-time",
        skills: ["React", "JavaScript (ES6+)", "CSS3 Glassmorphism", "HTML5", "Figma"],
        description: "Create pixel-perfect, light-theme glassmorphic interfaces for Zoho's cloud productivity suite with smooth 60fps micro-animations.",
        recruiter: recruiters[2]._id
      },
      {
        title: "Fintech Payments Engineer",
        company: "Razorpay",
        location: "Bangalore, Karnataka",
        salary: "₹22 - ₹35 LPA",
        experience: "3-6 Years",
        jobType: "Full-time",
        skills: ["Node.js", "MongoDB", "PostgreSQL", "Payment Gateways", "Security", "Docker"],
        description: "Scale India's premier payment infrastructure processing billions in digital transactions across UPI, Cards, and Net Banking.",
        recruiter: recruiters[3]._id
      },
      {
        title: "DevOps & Cloud Infrastructure Engineer",
        company: "Razorpay",
        location: "Pune, Maharashtra",
        salary: "₹18 - ₹30 LPA",
        experience: "2-5 Years",
        jobType: "Full-time",
        skills: ["AWS", "Kubernetes", "Docker", "CI/CD", "Terraform", "Monitoring"],
        description: "Automate zero-downtime deployment pipelines, enforce SOC2 security compliance, and manage Kubernetes clusters.",
        recruiter: recruiters[3]._id
      },
      {
        title: "Full Stack Growth Engineer",
        company: "Swiggy",
        location: "Bangalore, Karnataka",
        salary: "₹18 - ₹28 LPA",
        experience: "2-5 Years",
        jobType: "Full-time",
        skills: ["React", "Node.js", "Analytics", "A/B Testing", "Tailwind CSS"],
        description: "Build growth experiments, live hyper-local delivery tracking, and loyalty features across Swiggy and Instamart web platforms.",
        recruiter: recruiters[4]._id
      },
      {
        title: "Junior React Developer (Fresher Welcome)",
        company: "Swiggy",
        location: "Remote (India)",
        salary: "₹8 - ₹14 LPA",
        experience: "0-2 Years",
        jobType: "Full-time",
        skills: ["React", "JavaScript", "HTML", "CSS", "Git"],
        description: "Great entry-level role for passionate junior engineers to learn enterprise React patterns and contribute to customer-facing dashboards.",
        recruiter: recruiters[4]._id
      }
    ];

    const insertedJobs = await Job.insertMany(jobsData);
    console.log(`✅ Seeded ${insertedJobs.length} verified tech jobs.\n`);

    // 4. Create Active Applications with Full Hiring Pipeline States
    console.log("📋 Seeding multi-stage hiring applications & progress tracking...");

    const applicationsData = [
      // Application 1: Rahul -> Google (Offer Released!)
      {
        job: insertedJobs[0]._id, // Senior Full Stack Engineer at Google
        applicant: seekers[0]._id, // Rahul Sharma
        status: "Offer Released",
        stageDetails: {
          assessment: {
            link: "https://app.hackerrank.com/test/google-swe-2026",
            deadline: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            platform: "HackerRank",
            instructions: "Cleared with 100% score in DSA & System Design",
            score: "100/100"
          },
          technicalInterview: {
            scheduledAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            meetingLink: "https://meet.google.com/goo-tech-round",
            interviewer: "Siddharth Rao (Principal Architect)",
            notes: "Outstanding performance in MERN scalability and distributed caching."
          },
          hrInterview: {
            scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            meetingLink: "https://meet.google.com/goo-hr-fitment",
            interviewer: "Vikram Malhotra (Lead Recruiter)",
            notes: "Strong cultural alignment and compensation discussion completed."
          },
          offer: {
            ctc: "35.5",
            baseSalary: "30.0",
            joiningDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
            perks: ["₹3,00,000 Joining Bonus", "Health Cover ₹15L", "Hybrid Work Policy", "Wellness Allowance"],
            offerLetterNotes: "Welcome to Google Cloud Engineering team. Please review and digitally accept the proposal.",
            releasedAt: new Date()
          }
        },
        timeline: [
          { stage: "Applied", note: "Application submitted", updatedBy: seekers[0]._id, timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
          { stage: "Online Assessment", note: "Cleared DSA Assessment with 100% score", updatedBy: recruiters[0]._id, timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          { stage: "Technical Interview", note: "Cleared Tech Architecture round", updatedBy: recruiters[0]._id, timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
          { stage: "HR Interview", note: "Cleared HR culture fitment", updatedBy: recruiters[0]._id, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
          { stage: "Offer Released", note: "Formal Offer Letter of ₹35.5 LPA released", updatedBy: recruiters[0]._id, timestamp: new Date() }
        ]
      },

      // Application 2: Priya -> Flipkart (Technical Interview Scheduled)
      {
        job: insertedJobs[2]._id, // Backend Platform Engineer at Flipkart
        applicant: seekers[1]._id, // Priya Nair
        status: "Technical Interview",
        stageDetails: {
          assessment: {
            link: "https://leetcode.com/assessment/flipkart-platform",
            deadline: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            platform: "LeetCode Enterprise",
            instructions: "Completed 3 coding challenges",
            score: "95/100"
          },
          technicalInterview: {
            scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days
            meetingLink: "https://meet.google.com/flp-backend-live",
            interviewer: "Aditya Roy (Engineering Lead)",
            notes: "Focus on Node.js Event Loop, Redis caching, and Kafka streaming."
          }
        },
        timeline: [
          { stage: "Applied", note: "Application submitted", updatedBy: seekers[1]._id, timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
          { stage: "Online Assessment", note: "Cleared coding test", updatedBy: recruiters[1]._id, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
          { stage: "Technical Interview", note: "Technical Video Round scheduled", updatedBy: recruiters[1]._id, timestamp: new Date() }
        ]
      },

      // Application 3: Amit -> Zoho (Online Assessment Pending)
      {
        job: insertedJobs[4]._id, // SaaS Product Engineer at Zoho
        applicant: seekers[2]._id, // Amit Patel
        status: "Online Assessment",
        stageDetails: {
          assessment: {
            link: "https://tests.zoho.com/mern-assessment-2026",
            deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Due in 3 days
            platform: "Zoho Test Hub",
            instructions: "90 minutes test covering React state hooks, MongoDB aggregations, and REST API development."
          }
        },
        timeline: [
          { stage: "Applied", note: "Application received", updatedBy: seekers[2]._id, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
          { stage: "Online Assessment", note: "Online Assessment link sent to candidate", updatedBy: recruiters[2]._id, timestamp: new Date() }
        ]
      },

      // Application 4: Sneha -> Razorpay (HR Interview)
      {
        job: insertedJobs[6]._id, // Fintech Payments Engineer at Razorpay
        applicant: seekers[3]._id, // Sneha Reddy
        status: "HR Interview",
        stageDetails: {
          assessment: {
            link: "https://hackerrank.com/razorpay-payments-eval",
            deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            platform: "HackerRank",
            score: "92/100"
          },
          technicalInterview: {
            scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            meetingLink: "https://meet.google.com/rzp-tech-round",
            interviewer: "Gaurav Joshi (Staff Engineer)",
            notes: "Excellent knowledge of payment ledger architecture."
          },
          hrInterview: {
            scheduledAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
            meetingLink: "https://meet.google.com/rzp-hr-culture",
            interviewer: "Rohan Varma (Head of Talent)",
            notes: "Final discussion on benefits and joining timeline."
          }
        },
        timeline: [
          { stage: "Applied", note: "Applied via portal", updatedBy: seekers[3]._id, timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          { stage: "Online Assessment", note: "Cleared assessment", updatedBy: recruiters[3]._id, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
          { stage: "Technical Interview", note: "Cleared Technical Round", updatedBy: recruiters[3]._id, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
          { stage: "HR Interview", note: "HR Round scheduled for tomorrow", updatedBy: recruiters[3]._id, timestamp: new Date() }
        ]
      },

      // Application 5: Rahul -> Swiggy (Accepted / Hired!)
      {
        job: insertedJobs[8]._id, // Full Stack Growth Engineer at Swiggy
        applicant: seekers[0]._id, // Rahul Sharma
        status: "Accepted",
        stageDetails: {
          offer: {
            ctc: "26.0",
            baseSalary: "22.5",
            joiningDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            perks: ["₹2,00,000 Relocation allowance", "Unlimited Swiggy One", "Medical Insurance"],
            digitalSignature: "Rahul Sharma",
            acceptedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          }
        },
        timeline: [
          { stage: "Applied", note: "Application submitted", updatedBy: seekers[0]._id, timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) },
          { stage: "Online Assessment", note: "Cleared coding test", updatedBy: recruiters[4]._id, timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) },
          { stage: "Technical Interview", note: "Cleared Full Stack Architecture", updatedBy: recruiters[4]._id, timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
          { stage: "HR Interview", note: "Cleared HR Discussion", updatedBy: recruiters[4]._id, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
          { stage: "Offer Released", note: "Offer Released", updatedBy: recruiters[4]._id, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
          { stage: "Accepted", note: "Offer digitally signed & accepted by Rahul Sharma", updatedBy: seekers[0]._id, timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
        ]
      }
    ];

    const insertedApps = await Application.insertMany(applicationsData);
    console.log(`✅ Seeded ${insertedApps.length} active multi-stage applications.\n`);

    // 5. Seed Notifications
    console.log("🔔 Seeding candidate & recruiter in-app notifications...");
    await Notification.create([
      {
        recipient: seekers[0]._id, // Rahul
        sender: recruiters[0]._id,
        title: "🎉 Official Offer Letter Released!",
        message: "Google India has released your formal offer letter of ₹35.5 LPA. Review & sign now.",
        type: "offer",
        link: `/applications?appId=${insertedApps[0]._id}`,
        read: false
      },
      {
        recipient: seekers[1]._id, // Priya
        sender: recruiters[1]._id,
        title: "💻 Technical Round Scheduled",
        message: "Your Flipkart Backend Platform interview is scheduled for in 2 days on Google Meet.",
        type: "interview",
        link: `/applications?appId=${insertedApps[1]._id}`,
        read: false
      },
      {
        recipient: seekers[2]._id, // Amit
        sender: recruiters[2]._id,
        title: "📝 Online Assessment Invitation",
        message: "Zoho Corporation has invited you to take the MERN Developer Assessment.",
        type: "assessment",
        link: `/applications?appId=${insertedApps[2]._id}`,
        read: false
      },
      {
        recipient: recruiters[0]._id, // Vikram at Google
        sender: seekers[0]._id,
        title: "Candidate Applied",
        message: "Rahul Sharma applied for Senior Full Stack Engineer (MERN).",
        type: "info",
        link: "/recruiter/applications",
        read: true
      }
    ]);
    console.log("✅ Seeded in-app notifications.\n");

    console.log("=========================================================");
    console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=========================================================\n");

    console.log("🔑 READY-TO-USE DEMO LOGIN CREDENTIALS:");
    console.log("---------------------------------------------------------");
    console.log("🏢 RECRUITER ACCOUNTS (Password: Password@123)");
    console.log("  1. Google India:   recruiter@google.com");
    console.log("  2. Flipkart:       recruiter@flipkart.com");
    console.log("  3. Zoho:           recruiter@zoho.com");
    console.log("  4. Razorpay:       recruiter@razorpay.com");
    console.log("  5. Swiggy:         recruiter@swiggy.com\n");

    console.log("🎯 JOB SEEKER ACCOUNTS (Password: Password@123)");
    console.log("  1. Rahul Sharma:   seeker.rahul@gmail.com  (Has ₹35.5 LPA Offer & Hired!)");
    console.log("  2. Priya Nair:     seeker.priya@gmail.com  (Has Tech Round Scheduled)");
    console.log("  3. Amit Patel:     seeker.amit@gmail.com   (Has Assessment Ready)");
    console.log("  4. Sneha Reddy:    seeker.sneha@gmail.com  (Has HR Round Tomorrow)");
    console.log("---------------------------------------------------------\n");

    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedData();