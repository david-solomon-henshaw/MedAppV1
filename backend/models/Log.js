// models/Log.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const logSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, required: true },
  userType: { type: String, required: true, enum: ['Admin', 'Caregiver', 'Patient'] },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  action: { type: String, required: true }, // e.g., 'login', 'create_appointment'
  status: { type: String, required: true, enum: ['success', 'failure', 'pending'] },
  severity: { type: String, required: true, enum: ['info', 'warn', 'error'] },
  details: { type: String, default: '' } // additional context or error messages
});

// Optional index for faster querying by timestamp if needed
logSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Log', logSchema);
