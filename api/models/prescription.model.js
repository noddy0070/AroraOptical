import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  // User who owns this prescription
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // Basic prescription information
  prescriptionName: {
    type: String,
    required: true,
    trim: true,
  },
  
  prescriptionDate: {
    type: String,
    required: true,
  },
  
  // Right Eye (OD - Oculus Dexter) measurements
  rightEye: {
    sphere: {
      type: Number,
      required: false,
      min: -12.0,
      max: 12.25,
      validate: {
        validator: function(v) {
          return v === null || (v >= -12.0 && v <= 12.25);
        },
        message: 'Sphere value must be between -12.0 and +12.25'
      }
    },
    cylinder: {
      type: Number,
      required: false,
      min: -6.0,
      max: 6.25,
      validate: {
        validator: function(v) {
          return v === null || (v >= -6.0 && v <= 6.25);
        },
        message: 'Cylinder value must be between -6.0 and +6.25'
      }
    },
    axis: {
      type: Number,
      required: false,
      min: 1,
      max: 180,
      validate: {
        validator: function(v) {
          return v === null || (v >= 1 && v <= 180);
        },
        message: 'Axis value must be between 1 and 180'
      }
    },
    add: {
      type: Number,
      required: false,
      min: 0.25,
      max: 4.0,
      validate: {
        validator: function(v) {
          return v === null || (v >= 0.25 && v <= 4.0);
        },
        message: 'Add value must be between 0.25 and 4.0'
      }
    }
  },
  
  // Left Eye (OS - Oculus Sinister) measurements
  leftEye: {
    sphere: {
      type: Number,
      required: false,
      min: -12.0,
      max: 12.25,
      validate: {
        validator: function(v) {
          return v === null || (v >= -12.0 && v <= 12.25);
        },
        message: 'Sphere value must be between -12.0 and +12.25'
      }
    },
    cylinder: {
      type: Number,
      required: false,
      min: -6.0,
      max: 6.25,
      validate: {
        validator: function(v) {
          return v === null || (v >= -6.0 && v <= 6.25);
        },
        message: 'Cylinder value must be between -6.0 and +6.25'
      }
    },
    axis: {
      type: Number,
      required: false,
      min: 1,
      max: 180,
      validate: {
        validator: function(v) {
          return v === null || (v >= 1 && v <= 180);
        },
        message: 'Axis value must be between 1 and 180'
      }
    },
    add: {
      type: Number,
      required: false,
      min: 0.25,
      max: 4.0,
      validate: {
        validator: function(v) {
          return v === null || (v >= 0.25 && v <= 4.0);
        },
        message: 'Add value must be between 0.25 and 4.0'
      }
    }
  },
  
  // Pupillary Distance (PD) measurements
  pupillaryDistance: {
    // Main PD (single value or average)
    main: {
      type: String,
      required: false,
    },
    // Separate PD values for each eye (when twoPD is true)
    left: {
      type: Number,
      required: false,
      min: 23,
      max: 40,
      validate: {
        validator: function(v) {
          return v === null || (v >= 23 && v <= 40);
        },
        message: 'Left PD value must be between 23 and 40'
      }
    },
    right: {
      type: Number,
      required: false,
      min: 23,
      max: 40,
      validate: {
        validator: function(v) {
          return v === null || (v >= 23 && v <= 40);
        },
        message: 'Right PD value must be between 23 and 40'
      }
    },
    // Flag to indicate if separate PD values are used
    hasTwoValues: {
      type: Boolean,
      default: false,
    }
  },
  
  // Additional prescription details
  otherDetails: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  
  // Prescription type/usage
  prescriptionType: {
    type: String,
    enum: ['Distance', 'Reading', 'Bifocal', 'Progressive', 'Computer', 'Mixed'],
    default: 'Distance',
  },
  
  // Terms acceptance
  termsAccepted: {
    type: Boolean,
    required: true,
    default: false,
  },
  
  // Prescription image (if uploaded)
  prescriptionImage: {
    type: String, // URL to the uploaded image
    required: false,
  },
  
  // Prescription source
  source: {
    type: String,
    enum: ['Manual Entry', 'Image Upload','Imported'],
    default: 'Manual Entry',
  },
  
}, { 
  timestamps: true,
  // Add indexes for better query performance
  indexes: [
    { userId: 1 },
    { prescriptionDate: -1 },
    { 'rightEye.sphere': 1 },
    { 'leftEye.sphere': 1 },
  ]
});

// Virtual for prescription age in days
prescriptionSchema.virtual('ageInDays').get(function() {
  if (!this.prescriptionDate) return 0;
  const now = new Date();
  const diffTime = Math.abs(now - this.prescriptionDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Instance method to add history entry
prescriptionSchema.methods.addHistoryEntry = function(action, performedBy, notes = '') {
  this.history.push({
    action,
    performedBy,
    notes,
    timestamp: new Date()
  });
};

// Static method to find prescriptions for a user
prescriptionSchema.statics.findByUser = function(userId) {
  return this.find({ userId }).sort({ prescriptionDate: -1 });
};

// Ensure virtual fields are serialized
prescriptionSchema.set('toJSON', { virtuals: true });
prescriptionSchema.set('toObject', { virtuals: true });

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;
