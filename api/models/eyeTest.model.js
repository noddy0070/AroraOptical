import mongoose from 'mongoose';

const eyeTestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  testDate: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'No Show'],
    default: 'Scheduled',
  },
  previousEyeTest: {
    type: Boolean,
    default: false,
  },
  currentEyewear: {
    type: String,
    enum: ['None', 'Glasses', 'Contact Lenses', 'Both'],
    default: 'None',
  },
  specialNotes: {
    type: String,
  },
  cancellationReason: {
    type: String,
  },
  testResults: {
    rightEye: {
      sphere: String,
      cylinder: String,
      axis: String,
      vision: String,
    },
    leftEye: {
      sphere: String,
      cylinder: String,
      axis: String,
      vision: String,
    },
    pdDistance: String,
    recommendations: String,
  }
}, { timestamps: true });

// Add index for efficient querying
eyeTestSchema.index({ testDate: 1, timeSlot: 1 }, { unique: true });

const EyeTest = mongoose.model('EyeTest', eyeTestSchema);

export default EyeTest;