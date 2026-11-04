import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    studentName: {
      type: String,
      required: true,
      trim: true
    },
    rollNo: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
    course: {
      type: String,
      required: [true, 'Please specify the course'],
      trim: true
    },
    subject: {
      type: String,
      required: [true, 'Please specify the subject/module'],
      trim: true
    },
    facultyName: {
      type: String,
      required: [true, 'Please provide the instructor/faculty name'],
      trim: true
    },
    rating: {
      type: Number,
      required: [true, 'Please select an overall rating from 1 to 5'],
      min: 1,
      max: 5
    },
    categoryRatings: {
      contentClarity: { type: Number, min: 1, max: 5, default: 5 },
      teachingQuality: { type: Number, min: 1, max: 5, default: 5 },
      coursePace: { type: Number, min: 1, max: 5, default: 5 },
      practicalLab: { type: Number, min: 1, max: 5, default: 5 }
    },
    comments: {
      type: String,
      required: [true, 'Please enter your feedback comments'],
      trim: true,
      minlength: [5, 'Comments must be at least 5 characters long']
    },
    sentiment: {
      type: String,
      enum: ['Positive', 'Neutral', 'Constructive'],
      default: 'Positive'
    }
  },
  { timestamps: true }
);

// Index for high-performance dashboard searches
feedbackSchema.index({ course: 1, subject: 1, rating: -1 });

export default mongoose.model('Feedback', feedbackSchema);
