const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');

const cvsDir = path.join(__dirname, '..', 'uploads', 'cvs');
if (!fs.existsSync(cvsDir)) {
  fs.mkdirSync(cvsDir, { recursive: true });
}

// 1. Sara's Default CV (Frontend Focused)
const saraDefaultCvContent = `
SARA CONNOR
Junior Frontend Developer | sara@example.com | +1 (555) 234-5678 | San Francisco, CA
Portfolio: https://github.com/sara-dev | LinkedIn: linkedin.com/in/sara-dev

SUMMARY:
Motivated Frontend Developer with solid expertise in modern JavaScript, React, and responsive UI design. Passionate about building seamless user experiences.

EDUCATION:
- Bachelor of Science in Computer Science, Tech University (Graduated 2024, GPA: 3.8/4.0)

TECHNICAL SKILLS:
- Languages: JavaScript (ES6+), HTML5, CSS3
- Frameworks & Libraries: React, Tailwind CSS, Redux Toolkit
- Tools & Platforms: Git, GitHub, Vite, Webpack, Figma

PROJECTS:
1. E-Commerce UI Dashboard (React, Tailwind CSS)
   - Built a responsive dashboard with interactive charts and dynamic filtering.
2. Personal Portfolio Site (HTML5, Modern CSS, JavaScript)
   - High-performance, accessible portfolio with dark mode.
`;

// 2. Sara's Tailored CV (Full Stack Focused - mentions Next.js, TypeScript, Express.js, but NOT PostgreSQL!)
const saraTailoredCvContent = `
SARA CONNOR
Full Stack Developer | sara@example.com | +1 (555) 234-5678 | San Francisco, CA
Portfolio: https://github.com/sara-dev | LinkedIn: linkedin.com/in/sara-dev

SUMMARY:
Energetic Full Stack Developer with project experience building full-featured web applications using Next.js, TypeScript, and Express.js. Strong foundation in computer science and modern API development.

EDUCATION:
- Bachelor of Science in Computer Science, Tech University (Graduated 2024)
- Relevant Coursework: Data Structures, Algorithms, Web Engineering, Database Systems.

TECHNICAL SKILLS:
- Core Languages & Frameworks: Next.js, TypeScript, Express.js, React, Node.js, JavaScript (ES6+)
- API & Architecture: REST APIs, JWT Authentication, MVC Pattern
- Databases: MongoDB
- Tools & Methodologies: Git, Agile, Postman, Jest, Docker basics

PROFESSIONAL EXPERIENCE & PROJECTS:
- Junior Web Developer | DevCraft Studio (2024 - Present)
  - Developed full-stack features using Next.js and TypeScript for internal client platforms.
  - Implemented secure backend REST API endpoints using Express.js and Node.js.
  - Collaborated with senior engineers in sprint planning and code reviews.

- Project: TaskFlow Collaboration Platform
  - Created a real-time collaborative workspace using Next.js and Express.js with TypeScript.
  - Built JWT-based user authentication and role-based permissions.
`;

// 3. Alex Martin's CV
const alexCvContent = `
ALEX MARTIN
Frontend Engineer | alex@example.com | +1 (555) 345-6789 | Remote
TECHNICAL SKILLS:
- React, Tailwind CSS, JavaScript, REST APIs, HTML5, CSS3, Redux, Git
EXPERIENCE:
- Frontend Developer at WebSolutions (2 years): Built high-conversion client web apps with React and Tailwind CSS.
`;

// 4. Michael Chen's CV
const michaelCvContent = `
MICHAEL CHEN
Senior Backend Engineer | michael@example.com | +1 (555) 456-7890 | New York, NY
TECHNICAL SKILLS:
- Node.js, Express.js, MongoDB, Docker, Microservices, Redis, Git, Linux
EXPERIENCE:
- Senior Backend Architect at CloudScale (4 years): Designed high-throughput microservices using Node.js and Express.js.
`;

// Write CV sample files to disk
const saraDefaultPath = path.join(cvsDir, 'sara_default_cv.txt');
const saraTailoredPath = path.join(cvsDir, 'sara_tailored_cv.txt');
const alexCvPath = path.join(cvsDir, 'alex_martin_cv.txt');
const michaelCvPath = path.join(cvsDir, 'michael_chen_cv.txt');

fs.writeFileSync(saraDefaultPath, saraDefaultCvContent.trim());
fs.writeFileSync(saraTailoredPath, saraTailoredCvContent.trim());
fs.writeFileSync(alexCvPath, alexCvContent.trim());
fs.writeFileSync(michaelCvPath, michaelCvContent.trim());

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hireflow';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clean previous collections
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Notification.deleteMany({});
    console.log('Existing collections cleared.');

    // 1. Create Recruiter User: Atlas Digital
    const recruiter = await User.create({
      name: 'Atlas Digital Recruiter',
      email: 'recruiter@atlasdigital.com',
      password: 'password123',
      role: 'recruiter',
      companyInfo: {
        companyName: 'Atlas Digital',
        website: 'https://atlasdigital.example.com',
        location: 'San Francisco, CA',
        industry: 'Software & Technology',
        description: 'Atlas Digital is an innovative technology company building cutting-edge web and mobile solutions.',
        logoUrl: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=200&h=200&q=80'
      }
    });
    console.log('Recruiter created: recruiter@atlasdigital.com / password123');

    // 2. Create Candidate: Sara
    const sara = await User.create({
      name: 'Sara Connor',
      email: 'sara@example.com',
      password: 'password123',
      role: 'candidate',
      candidateProfile: {
        headline: 'Junior Full Stack Developer passionate about modern web technologies',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA',
        bio: 'Motivated Junior Developer with hands-on experience in Next.js, TypeScript, and Express.js. Strong advocate for clean architecture, automated testing, and thoughtful UX.',
        skills: ['Next.js', 'TypeScript', 'Express.js', 'React', 'Node.js', 'MongoDB', 'Git'],
        education: [
          {
            degree: 'Bachelor of Science in Computer Science',
            institution: 'Tech University',
            year: '2024'
          }
        ],
        experience: [
          {
            title: 'Junior Web Developer',
            company: 'DevCraft Studio',
            duration: '2024 - Present',
            description: 'Developed modern full-stack web applications using Next.js, TypeScript, and Express.js REST APIs.'
          }
        ],
        defaultCv: {
          filename: 'sara_default_cv.txt',
          originalName: 'Sara_Connor_Default_CV.txt',
          path: saraDefaultPath,
          url: '/uploads/cvs/sara_default_cv.txt',
          uploadedAt: new Date()
        }
      }
    });
    console.log('Candidate 1 created: sara@example.com / password123');

    // 3. Create Candidates Alex & Michael
    const alex = await User.create({
      name: 'Alex Martin',
      email: 'alex@example.com',
      password: 'password123',
      role: 'candidate',
      candidateProfile: {
        headline: 'Frontend Engineer | React & Tailwind CSS enthusiast',
        phone: '+1 (555) 345-6789',
        location: 'Remote',
        bio: 'Passionate frontend engineer with 2 years of React experience building clean, responsive user interfaces.',
        skills: ['React', 'Tailwind CSS', 'JavaScript', 'REST APIs', 'Git'],
        education: [{ degree: 'B.S. Software Engineering', institution: 'State University', year: '2023' }],
        experience: [{ title: 'Frontend Developer', company: 'WebSolutions', duration: '2023 - 2025', description: 'Built client interfaces using React and Tailwind.' }],
        defaultCv: {
          filename: 'alex_martin_cv.txt',
          originalName: 'Alex_Martin_Resume.txt',
          path: alexCvPath,
          url: '/uploads/cvs/alex_martin_cv.txt',
          uploadedAt: new Date()
        }
      }
    });

    const michael = await User.create({
      name: 'Michael Chen',
      email: 'michael@example.com',
      password: 'password123',
      role: 'candidate',
      candidateProfile: {
        headline: 'Senior Backend Engineer | Distributed Systems & Node.js',
        phone: '+1 (555) 456-7890',
        location: 'New York, NY',
        bio: 'Over 4 years designing resilient backend architectures, microservices, and databases.',
        skills: ['Node.js', 'Express.js', 'MongoDB', 'Docker', 'Microservices', 'Redis'],
        education: [{ degree: 'M.S. Computer Science', institution: 'Metro Tech', year: '2021' }],
        experience: [{ title: 'Senior Backend Engineer', company: 'CloudScale', duration: '2021 - Present', description: 'Architected scalable services with Node and MongoDB.' }],
        defaultCv: {
          filename: 'michael_chen_cv.txt',
          originalName: 'Michael_Chen_CV.txt',
          path: michaelCvPath,
          url: '/uploads/cvs/michael_chen_cv.txt',
          uploadedAt: new Date()
        }
      }
    });

    // 4. Create Job Openings for Atlas Digital
    // Job 1: Junior Full Stack Developer (The exact job from Page 11-12 scenario)
    const jobFullStack = await Job.create({
      recruiterId: recruiter._id,
      title: 'Junior Full Stack Developer',
      company: 'Atlas Digital',
      location: 'San Francisco, CA (Hybrid)',
      employmentType: 'Full-time',
      description: `Atlas Digital is looking for an enthusiastic Junior Full Stack Developer to build modern web applications.
You will collaborate with cross-functional product teams to deliver responsive user interfaces, robust REST APIs, and scalable database solutions.

Key Responsibilities:
• Build interactive web frontends using modern frameworks (Next.js / React) and TypeScript.
• Develop clean, secure RESTful APIs using Express.js and Node.js.
• Design, query, and maintain relational and non-relational database models (PostgreSQL, MongoDB).
• Participate in code reviews, automated testing, and CI/CD pipelines.`,
      requiredSkills: ['Next.js', 'TypeScript', 'Express.js', 'PostgreSQL'],
      qualifications: [
        "Bachelor's degree in Computer Science, Software Engineering, or equivalent practical experience",
        '1+ year hands-on experience building full-stack web applications',
        'Understanding of relational database design, SQL schemas, and PostgreSQL queries',
        'Familiarity with Git version control and modern team collaboration workflows'
      ],
      status: 'Published',
      viewsCount: 38
    });

    // Job 2: Frontend React Developer
    const jobFrontend = await Job.create({
      recruiterId: recruiter._id,
      title: 'Frontend React Developer',
      company: 'Atlas Digital',
      location: 'Remote',
      employmentType: 'Full-time',
      description: `We are seeking a Frontend React Developer to craft beautiful, responsive, and accessible digital products. You will turn UI/UX wireframes into performant, clean web apps.`,
      requiredSkills: ['React', 'Tailwind CSS', 'JavaScript', 'REST APIs'],
      qualifications: [
        'Demonstrated experience with React, state management, and modern CSS frameworks like Tailwind',
        'Eye for design fidelity, responsive layouts, and cross-browser testing'
      ],
      status: 'Published',
      viewsCount: 24
    });

    // Job 3: Senior Backend Engineer
    const jobBackend = await Job.create({
      recruiterId: recruiter._id,
      title: 'Senior Backend Engineer',
      company: 'Atlas Digital',
      location: 'New York, NY (On-site)',
      employmentType: 'Full-time',
      description: `Lead the design and implementation of distributed backend services, high-throughput microservices, and database clustering.`,
      requiredSkills: ['Node.js', 'Express.js', 'MongoDB', 'Docker', 'Microservices'],
      qualifications: [
        '3+ years backend software engineering experience',
        'Strong expertise in Node.js, asynchronous processing, and MongoDB data modeling'
      ],
      status: 'Published',
      viewsCount: 19
    });

    // Job 4: Data Pipeline Architect (Draft status)
    const jobDraft = await Job.create({
      recruiterId: recruiter._id,
      title: 'Data Pipeline Architect',
      company: 'Atlas Digital',
      location: 'San Francisco, CA',
      employmentType: 'Contract',
      description: 'Draft job posting for upcoming data infrastructure project.',
      requiredSkills: ['Python', 'Apache Kafka', 'PostgreSQL'],
      qualifications: ['Senior level data engineering experience'],
      status: 'Draft',
      viewsCount: 0
    });

    console.log('Sample jobs created.');

    // 5. Seed Applications matching the Scenario:
    // Sara's application to Junior Full Stack Developer
    // - Uses tailored CV (sara_tailored_cv.txt)
    // - Match score: 78/100 (matches Next.js, TypeScript, Express.js; PostgreSQL unverified)
    // - Status: 'Shortlisted'
    // - Recruiter note added
    const saraApplication = await Application.create({
      jobId: jobFullStack._id,
      candidateId: sara._id,
      recruiterId: recruiter._id,
      cvFile: {
        filename: 'sara_tailored_cv.txt',
        originalName: 'Sara_Connor_FullStack_Tailored_CV.txt',
        path: saraTailoredPath,
        url: '/uploads/cvs/sara_tailored_cv.txt',
        uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        isDefaultCvUsed: false
      },
      cvText: saraTailoredCvContent,
      coverNote:
        'I am very excited to apply for the Junior Full Stack Developer role at Atlas Digital! With hands-on experience developing projects in Next.js, TypeScript, and Express.js, I look forward to contributing immediately to your engineering workflows.',
      status: 'Shortlisted',
      statusHistory: [
        {
          status: 'Applied',
          changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          changedBy: sara._id
        },
        {
          status: 'Under Review',
          changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          changedBy: recruiter._id
        },
        {
          status: 'Shortlisted',
          changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          changedBy: recruiter._id
        }
      ],
      recruitmentNotes: [
        {
          authorId: recruiter._id,
          authorName: recruiter.name,
          text: 'Impressive project portfolio with Next.js and TypeScript. Good Express REST API architecture. Need to clarify relational database / PostgreSQL experience during interview.',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ],
      aiAnalysis: {
        matchScore: 78,
        summary:
          'Candidate CV demonstrates relevant background for Junior Full Stack Developer. Verified skills: Next.js, TypeScript, Express.js. Note: Evidence for PostgreSQL is not clearly visible in the submitted CV.',
        matchingSkills: ['Next.js', 'TypeScript', 'Express.js'],
        missingSkills: ['PostgreSQL'],
        matchingQualifications: [
          "Bachelor's degree in Computer Science, Software Engineering, or equivalent practical experience",
          '1+ year hands-on experience building full-stack web applications',
          'Familiarity with Git version control and modern team collaboration workflows'
        ],
        unverifiedRequirements: [
          'Understanding of relational database design, SQL schemas, and PostgreSQL queries'
        ],
        evidenceExplanation:
          'Demonstrates solid proficiency in key technical requirements including Next.js, TypeScript, Express.js. Experience with PostgreSQL was not explicitly documented in the submitted CV; recruiter may clarify this during interview.',
        analyzedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'completed',
        modelUsed: 'hireflow-intelligent-nlp-engine'
      }
    });

    // Alex's application to Frontend React Developer
    const alexApplication = await Application.create({
      jobId: jobFrontend._id,
      candidateId: alex._id,
      recruiterId: recruiter._id,
      cvFile: {
        filename: 'alex_martin_cv.txt',
        originalName: 'Alex_Martin_Resume.txt',
        path: alexCvPath,
        url: '/uploads/cvs/alex_martin_cv.txt',
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isDefaultCvUsed: true
      },
      cvText: alexCvContent,
      coverNote: 'Hello team, I specialize in crafting UI components with React and Tailwind CSS.',
      status: 'Under Review',
      statusHistory: [
        {
          status: 'Applied',
          changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          changedBy: alex._id
        },
        {
          status: 'Under Review',
          changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          changedBy: recruiter._id
        }
      ],
      recruitmentNotes: [
        {
          authorId: recruiter._id,
          authorName: recruiter.name,
          text: 'Solid 2 years experience with React. Reviewing GitHub code samples.',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ],
      aiAnalysis: {
        matchScore: 92,
        summary: 'Excellent match for Frontend React Developer position with strong React and Tailwind CSS background.',
        matchingSkills: ['React', 'Tailwind CSS', 'JavaScript', 'REST APIs'],
        missingSkills: [],
        matchingQualifications: [
          'Demonstrated experience with React, state management, and modern CSS frameworks like Tailwind',
          'Eye for design fidelity, responsive layouts, and cross-browser testing'
        ],
        unverifiedRequirements: [],
        evidenceExplanation:
          'Candidate documents hands-on professional delivery matching 100% of required frontend tools.',
        analyzedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'completed',
        modelUsed: 'hireflow-intelligent-nlp-engine'
      }
    });

    // Michael's application to Senior Backend Engineer
    const michaelApplication = await Application.create({
      jobId: jobBackend._id,
      candidateId: michael._id,
      recruiterId: recruiter._id,
      cvFile: {
        filename: 'michael_chen_cv.txt',
        originalName: 'Michael_Chen_CV.txt',
        path: michaelCvPath,
        url: '/uploads/cvs/michael_chen_cv.txt',
        uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isDefaultCvUsed: true
      },
      cvText: michaelCvContent,
      coverNote: 'Interested in leading distributed system backend architecture for Atlas Digital.',
      status: 'Applied',
      statusHistory: [
        {
          status: 'Applied',
          changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          changedBy: michael._id
        }
      ],
      recruitmentNotes: [],
      aiAnalysis: {
        matchScore: 88,
        summary: 'Strong backend engineering profile with Node.js, Express, MongoDB, and Docker.',
        matchingSkills: ['Node.js', 'Express.js', 'MongoDB', 'Docker', 'Microservices'],
        missingSkills: [],
        matchingQualifications: [
          '3+ years backend software engineering experience',
          'Strong expertise in Node.js, asynchronous processing, and MongoDB data modeling'
        ],
        unverifiedRequirements: [],
        evidenceExplanation: 'Strong experience documented across all key backend competencies.',
        analyzedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'completed',
        modelUsed: 'hireflow-intelligent-nlp-engine'
      }
    });

    // 6. Create notifications
    await Notification.create({
      recipientId: sara._id,
      title: 'Application Status Update',
      message: 'Your application for "Junior Full Stack Developer" at Atlas Digital has been updated to "Shortlisted".',
      type: 'status_update',
      applicationId: saraApplication._id,
      jobId: jobFullStack._id,
      isRead: false
    });

    await Notification.create({
      recipientId: recruiter._id,
      title: 'New Application Received',
      message: 'Sara Connor applied for "Junior Full Stack Developer". Match Score: 78/100.',
      type: 'application_received',
      applicationId: saraApplication._id,
      jobId: jobFullStack._id,
      isRead: true
    });

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
