// controllers/patientController.js
const Patient = require('../models/patient');
const Appointment = require('../models/appointment');
const bcrypt = require('bcrypt');

// Patient registration
exports.registerPatient = async (req, res) => {
  const { firstName, lastName, email, password, dateOfBirth, phoneNumber, gender } = req.body;

  try {
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) return res.status(400).json({ message: 'Patient already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newPatient = new Patient({
      firstName,
      lastName, 
      email,
      phoneNumber,
      password: hashedPassword,
      dateOfBirth,
      gender
    });
    await newPatient.save();
     

    res.status(201).json({ message: 'Patient registered successfully' });
  } catch (error) {
    console.log(error, "sign up patient");

    res.status(500).json({ message: 'Error registering patient', error });
  }
};

// Add an appointment to a patient
exports.addAppointment = async (req, res) => {
  const { patientRequestedDate, patientRequestedTime, department } = req.body;

  try {
    // Validate required fields
    if (!patientRequestedDate || !department || !patientRequestedTime) {
      return res.status(400).json({ message: 'Appointment date, department, and time are required' });
    }

    // Assuming patientId is extracted from a JWT or passed in the request body
    const patientId = req.body.patientId || req.user.id; // Replace with your authentication handling
    

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    } 

    // Create a new appointment
    const newAppointment = new Appointment({
      patient: patientId,
      patientRequestedDate,
      patientRequestedTime, // Patient's preferred time for the appointment
      department,
      status: 'pending', // Default status for a new appointment
      createdAt: Date.now(),
    });
    console.log(newAppointment)

    await newAppointment.save();

    // Push the appointment reference to the patient's appointments array
    patient.appointments.push(newAppointment._id);
    await patient.save();

    res.status(201).json({ message: 'Appointment requested successfully', appointment: newAppointment });
  } catch (error) {
    res.status(500).json({ message: 'Error requesting appointment', error });
  }
};

exports.getPatientProfile = async (req, res) => {
  const patientId = req.params.id;

  try {
    // Find the patient by ID and populate the appointments
    const patient = await Patient.findById(patientId).populate('appointments');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // 1. Total Appointments Booked
    const totalAppointments = patient.appointments.length;

    // 2. Total Caregivers (distinct caregivers associated with this patient's appointments)
    const caregiverCount = await Appointment.distinct('caregiver', { 
      patient: patientId,
      caregiver: { $exists: true } // Only count assigned caregivers
    });
    const totalCaregivers = caregiverCount.length;

    // 3. Total Medications Prescribed (count completed appointments)
    const completedAppointmentsCount = await Appointment.countDocuments({
      patient: patientId,
      status: 'completed'
    });

    // Return both the profile data and statistics
    res.status(200).json({
      profile: patient,
      statistics: {
        totalAppointments,
        totalCaregivers,
        totalMedicationsPrescribed: completedAppointmentsCount,
      }
    });
  } catch (error) {
    console.error('Error fetching patient profile and statistics:', error);
    res.status(500).json({ message: 'Error fetching patient profile and statistics', error });
  }
};