const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Job = require("./models/Job");
const Application = require("./models/Application");
const Notification = require("./models/Notification");

const seedData = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/jobconnect";

    console.log(
      `🔌 Connecting to MongoDB: ${mongoUri.replace(
        /:([^:@]{4})[^:@]*@/,
        ":****@"
      )}`
    );

    await mongoose.connect(mongoUri);

    console.log("✅ MongoDB connected successfully\n");

    // =========================================================
    // CLEAN EXISTING DATA
    // =========================================================

    console.log("🧹 Cleaning existing dataset...");

    await Job.deleteMany({});
    await Application.deleteMany({});
    await Notification.deleteMany({});

    // Delete old demo users
    await User.deleteMany({
      email: {
        $in: [
          "bharanikiruofl139@gmail.com",

          // Old recruiter emails
          "recruiter@google.com",
          "recruiter@flipkart.com",
          "recruiter@zoho.com",
          "recruiter@razorpay.com",
          "recruiter@swiggy.com",

          // Job seekers
          "seeker.rahul@gmail.com",
          "seeker.priya@gmail.com",
          "seeker.amit@gmail.com",
          "seeker.sneha@gmail.com",
        ],
      },
    });

    // =========================================================
    // PASSWORD
    // =========================================================

    console.log(
      "👥 Creating verified Recruiter & Job Seeker accounts..."
    );

    const defaultPassword = await bcrypt.hash(
      "Password@123",
      10
    );

    // =========================================================
    // 1. CREATE ONE RECRUITER
    // =========================================================

    const recruiters = await User.create([
      {
        name: "Bharani",
        email: "bharanikiruofl139@gmail.com",
        password: defaultPassword,
        role: "recruiter",
        isVerified: true,
      },
    ]);

    // =========================================================
    // 2. CREATE JOB SEEKERS
    // =========================================================

    const seekers = await User.create([
      {
        name: "Rahul Sharma",
        email: "seeker.rahul@gmail.com",
        password: defaultPassword,
        role: "jobseeker",
        isVerified: true,
      },

      {
        name: "Priya Nair",
        email: "seeker.priya@gmail.com",
        password: defaultPassword,
        role: "jobseeker",
        isVerified: true,
      },

      {
        name: "Amit Patel",
        email: "seeker.amit@gmail.com",
        password: defaultPassword,
        role: "jobseeker",
        isVerified: true,
      },

      {
        name: "Sneha Reddy",
        email: "seeker.sneha@gmail.com",
        password: defaultPassword,
        role: "jobseeker",
        isVerified: true,
      },
    ]);

    console.log(
      `✅ Created ${recruiters.length} Recruiter and ${seekers.length} Job Seekers.\n`
    );

    // =========================================================
    // 3. CREATE JOBS
    // =========================================================

    console.log(
      "💼 Seeding Indian Tech Jobs with Rupee (₹ LPA) compensation..."
    );

    const jobsData = [
      // =====================================================
      // JOB 1
      // =====================================================

      {
        title: "Senior Full Stack Engineer (MERN)",
        company: "Google India",
        location: "Bangalore, Karnataka",
        salary: "₹28 - ₹42 LPA",
        experience: "3-6 Years",
        jobType: "Full-time",

        skills: [
          "React",
          "Node.js",
          "TypeScript",
          "MongoDB",
          "System Design",
          "Docker",
        ],

        description:
          "Join Google's core Cloud platforms team to architect high-throughput web systems, resilient microservices, and modern React interfaces serving millions of enterprise customers globally.",

        // ONE RECRUITER
        recruiter: recruiters[0]._id,
      },

      // =====================================================
      // JOB 2
      // =====================================================

      {
        title: "Frontend Architect (React / Next.js)",
        company: "Google India",
        location: "Hyderabad, Telangana",
        salary: "₹32 - ₹48 LPA",
        experience: "5-8 Years",
        jobType: "Full-time",

        skills: [
          "React",
          "Next.js",
          "Web Performance",
          "State Management",
          "Tailwind CSS",
        ],

        description:
          "Lead UI architectural decisions, optimize Core Web Vitals, and build accessible, responsive components for Google Workspace cloud applications.",

        recruiter: recruiters[0]._id,
      },

      // =====================================================
      // JOB 3
      // =====================================================

      {
        title: "Backend Platform Engineer",
        company: "Flipkart",
        location: "Bangalore, Karnataka",
        salary: "₹20 - ₹34 LPA",
        experience: "2-5 Years",
        jobType: "Full-time",

        skills: [
          "Node.js",
          "Express.js",
          "Redis",
          "Kafka",
          "MongoDB",
          "Microservices",
        ],

        description:
          "Help build the backbone of India's largest e-commerce supply chain platform, handling Big Billion Day peak traffic with sub-50ms latency.",

        recruiter: recruiters[0]._id,
      },

      // =====================================================
      // JOB 4
      // =====================================================

      {
        title: "Lead React Native Developer",
        company: "Flipkart",
        location: "Bangalore, Karnataka",
        salary: "₹24 - ₹36 LPA",
        experience: "4-7 Years",
        jobType: "Full-time",

        skills: [
          "React Native",
          "TypeScript",
          "Redux Toolkit",
          "iOS",
          "Android",
        ],

        description:
          "Design and scale the consumer Flipkart mobile application used by over 100 million active Indian shoppers every month.",

        recruiter: recruiters[0]._id,
      },

      // =====================================================
      // JOB 5
      // =====================================================

      {
        title: "SaaS Product Engineer (MERN)",
        company: "Zoho Corporation",
        location: "Chennai, Tamil Nadu",
        salary: "₹12 - ₹20 LPA",
        experience: "1-4 Years",
        jobType: "Full-time",

        skills: [
          "React",
          "Node.js",
          "Express.js",
          "MongoDB",
          "REST APIs",
        ],

        description:
          "Join Zoho's product engineering team to build enterprise CRM and collaboration tools from our state-of-the-art Chennai development campus.",

        recruiter: recruiters[0]._id,
      },

      // =====================================================
      // JOB 6
      // =====================================================

      {
        title: "UI/UX Front-End Specialist",
        company: "Zoho Corporation",
        location: "Chennai, Tamil Nadu",
        salary: "₹10 - ₹16 LPA",
        experience: "1-3 Years",
        jobType: "Full-time",

        skills: [
          "React",
          "JavaScript (ES6+)",
          "CSS3 Glassmorphism",
          "HTML5",
          "Figma",
        ],

        description:
          "Create pixel-perfect, light-theme glassmorphic interfaces for Zoho's cloud productivity suite with smooth 60fps micro-animations.",

        recruiter: recruiters[0]._id,
      },

      // =====================================================
      // JOB 7
      // =====================================================

      {
        title: "Fintech Payments Engineer",
        company: "Razorpay",
        location: "Bangalore, Karnataka",
        salary: "₹22 - ₹35 LPA",
        experience: "3-6 Years",
        jobType: "Full-time",

        skills: [
          "Node.js",
          "MongoDB",
          "PostgreSQL",
          "Payment Gateways",
          "Security",
          "Docker",
        ],

        description:
          "Scale India's premier payment infrastructure processing billions in digital transactions across UPI, Cards, and Net Banking.",

        recruiter: recruiters[0]._id,
      },

      // =====================================================
      // JOB 8
      // =====================================================

      {
        title: "DevOps & Cloud Infrastructure Engineer",
        company: "Razorpay",
        location: "Pune, Maharashtra",
        salary: "₹18 - ₹30 LPA",
        experience: "2-5 Years",
        jobType: "Full-time",

        skills: [
          "AWS",
          "Kubernetes",
          "Docker",
          "CI/CD",
          "Terraform",
          "Monitoring",
        ],

        description:
          "Automate zero-downtime deployment pipelines, enforce SOC2 security compliance, and manage Kubernetes clusters.",

        recruiter: recruiters[0]._id,
      },

      // =====================================================
      // JOB 9
      // =====================================================

      {
        title: "Full Stack Growth Engineer",
        company: "Swiggy",
        location: "Bangalore, Karnataka",
        salary: "₹18 - ₹28 LPA",
        experience: "2-5 Years",
        jobType: "Full-time",

        skills: [
          "React",
          "Node.js",
          "Analytics",
          "A/B Testing",
          "Tailwind CSS",
        ],

        description:
          "Build growth experiments, live hyper-local delivery tracking, and loyalty features across Swiggy and Instamart web platforms.",

        recruiter: recruiters[0]._id,
      },

      // =====================================================
      // JOB 10
      // =====================================================

      {
        title: "Junior React Developer (Fresher Welcome)",
        company: "Swiggy",
        location: "Remote (India)",
        salary: "₹8 - ₹14 LPA",
        experience: "0-2 Years",
        jobType: "Full-time",

        skills: [
          "React",
          "JavaScript",
          "HTML",
          "CSS",
          "Git",
        ],

        description:
          "Great entry-level role for passionate junior engineers to learn enterprise React patterns and contribute to customer-facing dashboards.",

        recruiter: recruiters[0]._id,
      },
    ];

    const insertedJobs = await Job.insertMany(jobsData);

    console.log(
      `✅ Seeded ${insertedJobs.length} verified tech jobs.\n`
    );

    // =========================================================
    // 4. APPLICATIONS
    // =========================================================

    console.log(
      "📋 Seeding multi-stage hiring applications & progress tracking..."
    );

    const applicationsData = [
      // =====================================================
      // APPLICATION 1
      // Rahul -> Google
      // =====================================================

      {
        job: insertedJobs[0]._id,
        applicant: seekers[0]._id,

        status: "Offer Released",

        stageDetails: {
          assessment: {
            link:
              "https://app.hackerrank.com/test/google-swe-2026",

            deadline: new Date(
              Date.now() - 7 * 24 * 60 * 60 * 1000
            ),

            platform: "HackerRank",

            instructions:
              "Cleared with 100% score in DSA & System Design",

            score: "100/100",
          },

          technicalInterview: {
            scheduledAt: new Date(
              Date.now() - 4 * 24 * 60 * 60 * 1000
            ),

            meetingLink:
              "https://meet.google.com/goo-tech-round",

            interviewer:
              "Siddharth Rao (Principal Architect)",

            notes:
              "Outstanding performance in MERN scalability and distributed caching.",
          },

          hrInterview: {
            scheduledAt: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000
            ),

            meetingLink:
              "https://meet.google.com/goo-hr-fitment",

            interviewer:
              "Vikram Malhotra (Lead Recruiter)",

            notes:
              "Strong cultural alignment and compensation discussion completed.",
          },

          offer: {
            ctc: "35.5",
            baseSalary: "30.0",

            joiningDate: new Date(
              Date.now() + 20 * 24 * 60 * 60 * 1000
            ),

            perks: [
              "₹3,00,000 Joining Bonus",
              "Health Cover ₹15L",
              "Hybrid Work Policy",
              "Wellness Allowance",
            ],

            offerLetterNotes:
              "Welcome to Google Cloud Engineering team. Please review and digitally accept the proposal.",

            releasedAt: new Date(),
          },
        },

        timeline: [
          {
            stage: "Applied",
            note: "Application submitted",
            updatedBy: seekers[0]._id,
            timestamp: new Date(
              Date.now() - 10 * 24 * 60 * 60 * 1000
            ),
          },

          {
            stage: "Online Assessment",
            note:
              "Cleared DSA Assessment with 100% score",
            updatedBy: recruiters[0]._id,
            timestamp: new Date(
              Date.now() - 7 * 24 * 60 * 60 * 1000
            ),
          },

          {
            stage: "Technical Interview",
            note:
              "Cleared Tech Architecture round",
            updatedBy: recruiters[0]._id,
            timestamp: new Date(
              Date.now() - 4 * 24 * 60 * 60 * 1000
            ),
          },

          {
            stage: "HR Interview",
            note:
              "Cleared HR culture fitment",
            updatedBy: recruiters[0]._id,
            timestamp: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000
            ),
          },

          {
            stage: "Offer Released",
            note:
              "Formal Offer Letter of ₹35.5 LPA released",
            updatedBy: recruiters[0]._id,
            timestamp: new Date(),
          },
        ],
      },

      // =====================================================
      // APPLICATION 2
      // Priya -> Flipkart
      // =====================================================

      {
        job: insertedJobs[2]._id,
        applicant: seekers[1]._id,

        status: "Technical Interview",

        stageDetails: {
          assessment: {
            link:
              "https://leetcode.com/assessment/flipkart-platform",

            deadline: new Date(
              Date.now() - 3 * 24 * 60 * 60 * 1000
            ),

            platform: "LeetCode Enterprise",

            instructions:
              "Completed 3 coding challenges",

            score: "95/100",
          },

          technicalInterview: {
            scheduledAt: new Date(
              Date.now() + 2 * 24 * 60 * 60 * 1000
            ),

            meetingLink:
              "https://meet.google.com/flp-backend-live",

            interviewer:
              "Aditya Roy (Engineering Lead)",

            notes:
              "Focus on Node.js Event Loop, Redis caching, and Kafka streaming.",
          },
        },

        timeline: [
          {
            stage: "Applied",
            note: "Application submitted",
            updatedBy: seekers[1]._id,
            timestamp: new Date(
              Date.now() - 6 * 24 * 60 * 60 * 1000
            ),
          },

          {
            stage: "Online Assessment",
            note: "Cleared coding test",
            updatedBy: recruiters[0]._id,
            timestamp: new Date(
              Date.now() - 3 * 24 * 60 * 60 * 1000
            ),
          },

          {
            stage: "Technical Interview",
            note:
              "Technical Video Round scheduled",
            updatedBy: recruiters[0]._id,
            timestamp: new Date(),
          },
        ],
      },

      // =====================================================
      // APPLICATION 3
      // Amit -> Zoho
      // =====================================================

      {
        job: insertedJobs[4]._id,
        applicant: seekers[2]._id,

        status: "Online Assessment",

        stageDetails: {
          assessment: {
            link:
              "https://tests.zoho.com/mern-assessment-2026",

            deadline: new Date(
              Date.now() + 3 * 24 * 60 * 60 * 1000
            ),

            platform: "Zoho Test Hub",

            instructions:
              "90 minutes test covering React state hooks, MongoDB aggregations, and REST API development.",
          },
        },

        timeline: [
          {
            stage: "Applied",
            note: "Application received",
            updatedBy: seekers[2]._id,
            timestamp: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000
            ),
          },

          {
            stage: "Online Assessment",
            note:
              "Online Assessment link sent to candidate",
            updatedBy: recruiters[0]._id,
            timestamp: new Date(),
          },
        ],
      },

      // =====================================================
      // APPLICATION 4
      // Sneha -> Razorpay
      // =====================================================

      {
        job: insertedJobs[6]._id,
        applicant: seekers[3]._id,

        status: "HR Interview",

        stageDetails: {
          assessment: {
            link:
              "https://hackerrank.com/razorpay-payments-eval",

            deadline: new Date(
              Date.now() - 5 * 24 * 60 * 60 * 1000
            ),

            platform: "HackerRank",

            score: "92/100",
          },

          technicalInterview: {
            scheduledAt: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000
            ),

            meetingLink:
              "https://meet.google.com/rzp-tech-round",

            interviewer:
              "Gaurav Joshi (Staff Engineer)",

            notes:
              "Excellent knowledge of payment ledger architecture.",
          },

          hrInterview: {
            scheduledAt: new Date(
              Date.now() + 1 * 24 * 60 * 60 * 1000
            ),

            meetingLink:
              "https://meet.google.com/rzp-hr-culture",

            interviewer:
              "Rohan Varma (Head of Talent)",

            notes:
              "Final discussion on benefits and joining timeline.",
          },
        },

        timeline: [
          {
            stage: "Applied",
            note: "Applied via portal",
            updatedBy: seekers[3]._id,
            timestamp: new Date(
              Date.now() - 7 * 24 * 60 * 60 * 1000
            ),
          },

          {
            stage: "Online Assessment",
            note: "Cleared assessment",
            updatedBy: recruiters[0]._id,
            timestamp: new Date(
              Date.now() - 5 * 24 * 60 * 60 * 1000
            ),
          },

          {
            stage: "Technical Interview",
            note: "Cleared Technical Round",
            updatedBy: recruiters[0]._id,
            timestamp: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000
            ),
          },

          {
            stage: "HR Interview",
            note:
              "HR Round scheduled for tomorrow",
            updatedBy: recruiters[0]._id,
            timestamp: new Date(),
          },
        ],
      },

      // =====================================================
      // APPLICATION 5
      // Rahul -> Swiggy
      // =====================================================

      {
        job: insertedJobs[8]._id,
        applicant: seekers[0]._id,

        status: "Accepted",

        stageDetails: {
          offer: {
            ctc: "26.0",
            baseSalary: "22.5",

            joiningDate: new Date(
              Date.now() + 15 * 24 * 60 * 60 * 1000
            ),

            perks: [
              "₹2,00,000 Relocation allowance",
              "Unlimited Swiggy One",
              "Medical Insurance",
            ],

            digitalSignature: "Rahul Sharma",

            acceptedAt: new Date(
              Date.now() - 1 * 24 * 60 * 60 * 1000
            ),
          },
        },

        timeline: [
          {
            stage: "Applied",
            note: "Application submitted",
            updatedBy: seekers[0]._id,
            timestamp: new Date(
              Date.now() - 12 * 24 * 60 * 60 * 1000
            ),
          },

          {
            stage: "Online Assessment",
            note: "Cleared coding test",
            updatedBy: recruiters[0]._id,
            timestamp: new Date(
              Date.now() - 9 * 24 * 60 * 60 * 1000
            ),
          },

          {
            stage: "Technical Interview",
            note:
              "Cleared Full Stack Architecture",
            updatedBy: recruiters[0]._id,
            timestamp: new Date(
              Date.now() - 6 * 24 * 60 * 60 * 1000
            ),
          },

          {
            stage: "HR Interview",
            note:
              "Cleared HR Discussion",
            updatedBy: recruiters[0]._id,
            timestamp: new Date(
              Date.now() - 3 * 24 * 60 * 60 * 1000
            ),
          },

          {
            stage: "Offer Released",
            note: "Offer Released",
            updatedBy: recruiters[0]._id,
            timestamp: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000
            ),
          },

          {
            stage: "Accepted",
            note:
              "Offer digitally signed & accepted by Rahul Sharma",
            updatedBy: seekers[0]._id,
            timestamp: new Date(
              Date.now() - 1 * 24 * 60 * 60 * 1000
            ),
          },
        ],
      },
    ];

    const insertedApps =
      await Application.insertMany(applicationsData);

    console.log(
      `✅ Seeded ${insertedApps.length} active multi-stage applications.\n`
    );

    // =========================================================
    // 5. NOTIFICATIONS
    // =========================================================

    console.log(
      "🔔 Seeding candidate & recruiter in-app notifications..."
    );

    await Notification.create([
      {
        recipient: seekers[0]._id,
        sender: recruiters[0]._id,

        title:
          "🎉 Official Offer Letter Released!",

        message:
          "Google India has released your formal offer letter of ₹35.5 LPA. Review & sign now.",

        type: "offer",

        link:
          `/applications?appId=${insertedApps[0]._id}`,

        read: false,
      },

      {
        recipient: seekers[1]._id,
        sender: recruiters[0]._id,

        title:
          "💻 Technical Round Scheduled",

        message:
          "Your Flipkart Backend Platform interview is scheduled for in 2 days on Google Meet.",

        type: "interview",

        link:
          `/applications?appId=${insertedApps[1]._id}`,

        read: false,
      },

      {
        recipient: seekers[2]._id,
        sender: recruiters[0]._id,

        title:
          "📝 Online Assessment Invitation",

        message:
          "Zoho Corporation has invited you to take the MERN Developer Assessment.",

        type: "assessment",

        link:
          `/applications?appId=${insertedApps[2]._id}`,

        read: false,
      },

      // Recruiter notification
      {
        recipient: recruiters[0]._id,
        sender: seekers[0]._id,

        title: "Candidate Applied",

        message:
          "Rahul Sharma applied for Senior Full Stack Engineer (MERN).",

        type: "info",

        link: "/recruiter/applications",

        read: true,
      },
    ]);

    console.log(
      "✅ Seeded in-app notifications.\n"
    );

    // =========================================================
    // SUCCESS
    // =========================================================

    console.log(
      "========================================================="
    );

    console.log(
      "🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!"
    );

    console.log(
      "=========================================================\n"
    );

    // =========================================================
    // LOGIN DETAILS
    // =========================================================

    console.log(
      "🔑 READY-TO-USE DEMO LOGIN CREDENTIALS:"
    );

    console.log(
      "---------------------------------------------------------"
    );

    console.log(
      "🏢 RECRUITER ACCOUNT"
    );

    console.log(
      "Email:    bharanikiruofl139@gmail.com"
    );

    console.log(
      "Password: Password@123\n"
    );

    console.log(
      "🎯 JOB SEEKER ACCOUNTS"
    );

    console.log(
      "  1. Rahul Sharma:   seeker.rahul@gmail.com"
    );

    console.log(
      "  2. Priya Nair:     seeker.priya@gmail.com"
    );

    console.log(
      "  3. Amit Patel:     seeker.amit@gmail.com"
    );

    console.log(
      "  4. Sneha Reddy:    seeker.sneha@gmail.com"
    );

    console.log(
      "Password for all: Password@123"
    );

    console.log(
      "---------------------------------------------------------\n"
    );

    // =========================================================
    // CLOSE DATABASE
    // =========================================================

    await mongoose.connection.close();

    console.log(
      "🔌 MongoDB connection closed."
    );

    process.exit(0);

  } catch (error) {

    console.error(
      "❌ Seeding error:",
      error
    );

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedData();