import Feedback from '../models/Feedback.js';

// Calculate sentiment helper
const computeSentiment = (rating, comments) => {
  const text = (comments || '').toLowerCase();
  const positiveWords = ['excellent', 'great', 'good', 'clear', 'helpful', 'engaging', 'thorough', 'best', 'enjoyed'];
  const constructiveWords = ['slow', 'difficult', 'improve', 'hard', 'poor', 'bad', 'issue', 'confusing', 'fast'];

  let posCount = positiveWords.filter(w => text.includes(w)).length;
  let conCount = constructiveWords.filter(w => text.includes(w)).length;

  if (rating >= 4 || posCount > conCount) return 'Positive';
  if (rating === 3) return 'Neutral';
  return 'Constructive';
};

// @desc    Submit new feedback
// @route   POST /api/feedback
export const createFeedback = async (req, res) => {
  try {
    const { subject, facultyName, rating, categoryRatings, comments, course } = req.body;

    if (!subject || !facultyName || !rating || !comments) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subject, instructor name, rating, and feedback comments.'
      });
    }

    const assignedCourse = course || req.user.course || 'Computer Science & Engineering';
    const sentiment = computeSentiment(Number(rating), comments);

    const feedback = await Feedback.create({
      student: req.user._id,
      studentName: req.user.name,
      rollNo: req.user.rollNo,
      course: assignedCourse,
      subject,
      facultyName,
      rating: Number(rating),
      categoryRatings: categoryRatings || {
        contentClarity: Number(rating),
        teachingQuality: Number(rating),
        coursePace: Number(rating),
        practicalLab: Number(rating)
      },
      comments,
      sentiment
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully! Thank you for your evaluation.',
      feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting feedback'
    });
  }
};

// @desc    Get current student's feedback history
// @route   GET /api/feedback/my
export const getMyFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ student: req.user._id }).sort({ createdAt: -1 });

    const totalSubmissions = feedbacks.length;
    const avgRating = totalSubmissions > 0
      ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / totalSubmissions).toFixed(1)
      : '0.0';

    res.json({
      success: true,
      count: totalSubmissions,
      avgRating,
      feedbacks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching student feedback history'
    });
  }
};

// @desc    Delete own feedback
// @route   DELETE /api/feedback/:id
export const deleteMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback record not found'
      });
    }

    if (feedback.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this feedback'
      });
    }

    await Feedback.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Feedback entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting feedback'
    });
  }
};
