const mongoose = require('mongoose');
const { Schema } = mongoose;

// Action Log Schema to track actions and errors for all users
const actionLogSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, // Reference to Admin, Patient, or Caregiver
    refPath: 'userRole',  // This dynamically refers to the appropriate collection
    required: false,  // Set to false to allow null in case of error or failed actions
  },
  
  userRole: {
    type: String,
    enum: ['admin', 'patient', 'caregiver'],  // Dynamically references the user's role
    required: true
  },

  action: {
    type: String,
    enum: [
      'login', 'register', 'create_appointment', 'update_appointment', 'view_appointments', 'view_profile', 
      'verify_otp', 'admin_register', 'admin_update', 'admin_delete', 'appointment_create', 'appointment_update',
      'appointment_cancel', 'appointment_approve', 'appointment_suspend', 'caregiver_create', 'caregiver_update',
      'caregiver_delete', 'patient_create', 'patient_update', 'patient_delete', 'caregiver_login', 'patient_login',
      'patient_logout', 'patient_book_appointment', 'caregiver_update_appointment', 'password_reset'
    ],
    required: true
  },

  description: {
    type: String, // Detailed description of the action or error
    required: true
  },

  entity: {
    type: String,
    required: true,
    enum: ['admin', 'appointment', 'caregiver', 'patient', 'error'], // 'error' entity for error logs
  },
  entityId: {
    type: Schema.Types.ObjectId,
    required: function () {
      return this.entity !== 'error'; // Make `entityId` optional if the entity is 'error'
    },
    refPath: 'entity',
  },  

  timestamp: {
    type: Date,
    default: Date.now,  // Automatically set the current timestamp when a log is created
  },

  errorDetails: {
    type: String,  // For logging error message details
    required: false,  // Only required if the action is an error
  },

  status: {
    type: String,
    enum: ['success', 'failed'],
    required: true,  // Track whether the action was successful or failed
  },

});

const ActionLog = mongoose.model('ActionLog', actionLogSchema);

module.exports = ActionLog;
