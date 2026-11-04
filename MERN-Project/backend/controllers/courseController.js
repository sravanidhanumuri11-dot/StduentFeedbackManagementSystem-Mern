import Course from '../models/Course.js';

export const getCourses = async (req, res) => {
  try {
    let courses = await Course.find();

    if (!courses || courses.length === 0) {
      // Fallback predefined courses
      courses = [
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
      ];
    }

    res.json({
      success: true,
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching course list'
    });
  }
};
