import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';
import Course from '../models/Course.js';

dotenv.config();

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_feedback_mern';
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB at ${mongoUri}`);

    // 1. Seed Courses
    await Course.deleteMany({});
    const courses = await Course.insertMany([
      {
        code: 'CSE',
        name: 'Computer Science & Engineering',
        department: 'Computer Science',
        subjects: [
          { name: 'Data Structures & Algorithms', faculty: 'Prof. Robert Vance', semester: 3 },
          { name: 'Database Management Systems', faculty: 'Dr. Michael Scott', semester: 4 },
          { name: 'Web Technologies (MERN Stack)', faculty: 'Prof. Pam Beesly', semester: 5 },
          { name: 'Operating Systems & Linux', faculty: 'Dr. Jim Halpert', semester: 4 }
        ]
      },
      {
        code: 'AIML',
        name: 'AI & Machine Learning',
        department: 'Artificial Intelligence',
        subjects: [
          { name: 'Deep Learning & Neural Networks', faculty: 'Dr. Angela Martin', semester: 5 },
          { name: 'Natural Language Processing', faculty: 'Prof. Oscar Martinez', semester: 6 },
          { name: 'Computer Vision', faculty: 'Prof. Toby Flenderson', semester: 5 }
        ]
      },
      {
        code: 'DS',
        name: 'Data Science',
        department: 'Data Analytics',
        subjects: [
          { name: 'Big Data Analytics & Spark', faculty: 'Dr. Stanley Hudson', semester: 5 },
          { name: 'Statistical Inference & Probability', faculty: 'Prof. Phyllis Vance', semester: 3 },
          { name: 'Data Visualization & BI', faculty: 'Dr. Kevin Malone', semester: 4 }
        ]
      },
      {
        code: 'IT',
        name: 'Information Technology',
        department: 'Information Science',
        subjects: [
          { name: 'Cloud Computing & DevOps', faculty: 'Prof. Dwight Schrute', semester: 6 },
          { name: 'Cybersecurity & Ethical Hacking', faculty: 'Dr. Andy Bernard', semester: 5 },
          { name: 'Computer Networks', faculty: 'Prof. Kelly Kapoor', semester: 4 }
        ]
      }
    ]);
    console.log(`🌱 Seeded ${courses.length} courses with subjects`);

    // 2. Seed Admin & Students
    await User.deleteMany({});

    // Admin user
    const admin = await User.create({
      name: 'Prof. Robert Vance',
      rollNo: 'ADMIN',
      email: 'admin@college.edu',
      password: 'admin123',
      course: 'Administration',
      role: 'admin'
    });
    console.log(`🌱 Created Admin: admin@college.edu / admin123 (rollNo: ADMIN)`);

    // Student users
    const studentsData = [
      {
        name: 'Aarav Sharma',
        rollNo: 'CS202601',
        email: 'aarav.sharma@college.edu',
        password: 'student123',
        course: 'Computer Science & Engineering',
        role: 'student'
      },
      {
        name: 'Diya Patel',
        rollNo: 'CS202602',
        email: 'diya.patel@college.edu',
        password: 'student123',
        course: 'Computer Science & Engineering',
        role: 'student'
      },
      {
        name: 'Rohan Gupta',
        rollNo: 'AI202615',
        email: 'rohan.gupta@college.edu',
        password: 'student123',
        course: 'AI & Machine Learning',
        role: 'student'
      },
      {
        name: 'Ananya Iyer',
        rollNo: 'DS202633',
        email: 'ananya.iyer@college.edu',
        password: 'student123',
        course: 'Data Science',
        role: 'student'
      },
      {
        name: 'Vikram Singh',
        rollNo: 'IT202644',
        email: 'vikram.singh@college.edu',
        password: 'student123',
        course: 'Information Technology',
        role: 'student'
      }
    ];

    const students = [];
    for (const s of studentsData) {
      const student = await User.create(s);
      students.push(student);
    }
    console.log(`🌱 Seeded ${students.length} students`);

    // 3. Seed Feedback Entries
    await Feedback.deleteMany({});
    const sampleFeedbacks = [
      {
        student: students[0]._id,
        studentName: students[0].name,
        rollNo: students[0].rollNo,
        course: students[0].course,
        subject: 'Data Structures & Algorithms',
        facultyName: 'Prof. Robert Vance',
        rating: 5,
        categoryRatings: { contentClarity: 5, teachingQuality: 5, coursePace: 5, practicalLab: 5 },
        comments: 'Prof. Vance explains graph algorithms with great clarity and real-world analogies. The laboratory sessions are well-guided and challenging.',
        sentiment: 'Positive'
      },
      {
        student: students[1]._id,
        studentName: students[1].name,
        rollNo: students[1].rollNo,
        course: students[1].course,
        subject: 'Web Technologies (MERN Stack)',
        facultyName: 'Prof. Pam Beesly',
        rating: 5,
        categoryRatings: { contentClarity: 5, teachingQuality: 5, coursePace: 4, practicalLab: 5 },
        comments: 'Outstanding coverage of React Hooks, Express routing, and MongoDB aggregations. Hands-on projects make modern full-stack development crystal clear!',
        sentiment: 'Positive'
      },
      {
        student: students[2]._id,
        studentName: students[2].name,
        rollNo: students[2].rollNo,
        course: students[2].course,
        subject: 'Deep Learning & Neural Networks',
        facultyName: 'Dr. Angela Martin',
        rating: 4,
        categoryRatings: { contentClarity: 4, teachingQuality: 4, coursePace: 4, practicalLab: 4 },
        comments: 'Rigorous theoretical foundations with clear mathematical derivations. A few more GPU compute credits for PyTorch vision assignments would be wonderful.',
        sentiment: 'Positive'
      },
      {
        student: students[3]._id,
        studentName: students[3].name,
        rollNo: students[3].rollNo,
        course: students[3].course,
        subject: 'Big Data Analytics & Spark',
        facultyName: 'Dr. Stanley Hudson',
        rating: 4,
        categoryRatings: { contentClarity: 4, teachingQuality: 4, coursePace: 3, practicalLab: 5 },
        comments: 'Very engaging curriculum. Distributed data transformations on Spark cluster were well explained and helped solidify MapReduce principles.',
        sentiment: 'Positive'
      },
      {
        student: students[4]._id,
        studentName: students[4].name,
        rollNo: students[4].rollNo,
        course: students[4].course,
        subject: 'Cloud Computing & DevOps',
        facultyName: 'Prof. Dwight Schrute',
        rating: 3,
        categoryRatings: { contentClarity: 3, teachingQuality: 4, coursePace: 3, practicalLab: 3 },
        comments: 'Curriculum structure is solid, but the cloud sandbox environment experienced occasional latency during heavy lab hours.',
        sentiment: 'Neutral'
      },
      {
        student: students[0]._id,
        studentName: students[0].name,
        rollNo: students[0].rollNo,
        course: students[0].course,
        subject: 'Database Management Systems',
        facultyName: 'Dr. Michael Scott',
        rating: 5,
        categoryRatings: { contentClarity: 5, teachingQuality: 5, coursePace: 5, practicalLab: 5 },
        comments: 'Query optimization, indexing strategies, and ACID transaction discussions were top tier! Highly recommend this course.',
        sentiment: 'Positive'
      }
    ];

    await Feedback.insertMany(sampleFeedbacks);
    console.log(`🌱 Seeded ${sampleFeedbacks.length} initial student feedback submissions`);

    console.log('✅ Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database seed:', error);
    process.exit(1);
  }
};

seed();
