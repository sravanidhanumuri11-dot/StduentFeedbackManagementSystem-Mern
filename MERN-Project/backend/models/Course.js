import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  faculty: { type: String, required: true },
  semester: { type: Number, default: 1 }
});

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    department: {
      type: String,
      required: true,
      trim: true
    },
    subjects: [subjectSchema]
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
