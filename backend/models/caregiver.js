// models/Caregiver.js
const mongoose = require('mongoose');
const { Schema } = mongoose;



const caregiverSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phoneNumber: { 
    type: String, 
    required: true,
    match: [/^\d{10}$/, 'Please enter a valid phone number'] 
  },
  password: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, default: 'caregiver' },
  otp: { type: String, default: "" },
otpExpiresAt: { type: Date, default: null },
  token: { type: String, default: "" }, // for session management
  available: { type: Boolean, default: true } // Availability status
}, { timestamps: true });



module.exports = mongoose.model('Caregiver', caregiverSchema);