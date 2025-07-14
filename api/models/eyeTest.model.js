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
  specialNotes: {
    type: String,
  },
  cancellationReason: {
    type: String,
    required:false
  },
}, { timestamps: true });

// Add index for efficient querying
eyeTestSchema.index({ testDate: 1, timeSlot: 1 }, { unique: true });

const EyeTest = mongoose.model('EyeTest', eyeTestSchema);

export default EyeTest;