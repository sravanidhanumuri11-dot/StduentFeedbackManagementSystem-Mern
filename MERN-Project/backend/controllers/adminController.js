import Feedback from '../models/Feedback.js';
import User from '../models/User.js';

// @desc    Get dashboard metrics & statistical breakdown
// @route   GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const totalFeedback = await Feedback.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });

    // Aggregate average rating
    const avgResult = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    const overallAvg = avgResult.length > 0 ? avgResult[0].avgRating.toFixed(2) : '0.00';

    // Rating distribution (1 to 5 stars)
    const ratingDist = await Feedback.aggregate([
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratingDist.forEach(item => {
      if (distribution[item._id] !== undefined) {
        distribution[item._id] = item.count;
      }
    });

    // Course breakdown
    const courseStats = await Feedback.aggregate([
      {
        $group: {
          _id: '$course',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Sentiment breakdown
    const sentimentStats = await Feedback.aggregate([
      {
        $group: {
          _id: '$sentiment',
          count: { $sum: 1 }
        }
      }
    ]);
    const sentiments = { Positive: 0, Neutral: 0, Constructive: 0 };
    sentimentStats.forEach(s => {
      if (s._id) sentiments[s._id] = s.count;
    });

    // Recent 5 feedbacks
    const recentFeedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalFeedback,
        totalStudents,
        overallAvg,
        distribution,
        courseStats: courseStats.map(c => ({
          course: c._id,
          count: c.count,
          avgRating: c.avgRating.toFixed(2)
        })),
        sentiments,
        recentFeedbacks
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error compiling analytics dashboard'
    });
  }
};

// @desc    Get all feedback with filtering and searching
// @route   GET /api/admin/feedbacks
export const getAllFeedbacks = async (req, res) => {
  try {
    const { search, course, rating, sort } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { facultyName: { $regex: search, $options: 'i' } },
        { comments: { $regex: search, $options: 'i' } }
      ];
    }

    if (course && course !== 'All') {
      filter.course = course;
    }

    if (rating && rating !== 'All') {
      filter.rating = Number(rating);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'highest') sortOption = { rating: -1, createdAt: -1 };
    if (sort === 'lowest') sortOption = { rating: 1, createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const feedbacks = await Feedback.find(filter).sort(sortOption);

    res.json({
      success: true,
      count: feedbacks.length,
      feedbacks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving feedback records'
    });
  }
};

// @desc    Admin delete any feedback
// @route   DELETE /api/admin/feedbacks/:id
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Feedback entry deleted by administrator'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting feedback'
    });
  }
};

// @desc    Get list of all registered students
// @route   GET /api/admin/students
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Count submissions per student
    const studentIds = students.map(s => s._id);
    const feedbackCounts = await Feedback.aggregate([
      { $match: { student: { $in: studentIds } } },
      { $group: { _id: '$student', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    feedbackCounts.forEach(c => {
      countMap[c._id.toString()] = c.count;
    });

    const studentsWithCount = students.map(s => ({
      ...s.toObject(),
      feedbackCount: countMap[s._id.toString()] || 0
    }));

    res.json({
      success: true,
      count: studentsWithCount.length,
      students: studentsWithCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching student roster'
    });
  }
};

// @desc    Export feedback data
// @route   GET /api/admin/export
export const exportFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      exportedAt: new Date().toISOString(),
      feedbacks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
