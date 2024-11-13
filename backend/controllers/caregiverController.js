const Appointment = require('../models/appointment');
const Caregiver = require('../models/caregiver')
const Patient = require('../models/patient')


// View appointments assigned to a caregiver
exports.viewAppointments = async (req, res) => {
  const caregiverId = req.params.id;

  try {
    // Find appointments associated with the caregiver
    const appointments = await Appointment.find({ caregiver: caregiverId });

  
    if (!appointments.length) {
      return res.status(404).json({ message: 'No appointments found for this caregiver' });
    }
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 


exports.updateAppointment = async (req, res) => {
  const  appointmentId = req.params.id;
  const { status, endTime } = req.body;

  try {
    // Find the appointment by ID
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update the appointment's status and endTime
    if (status === 'in-progress') {
      appointment.status = 'in-progress';
      // We don't need to set endTime for in-progress status
      appointment.startTime = new Date().toISOString(); // Set start time to current time when status is 'in-progress'
    } else if (status === 'completed') {
      appointment.status = 'completed';
      appointment.endTime = endTime || new Date().toISOString(); // Set endTime if provided, else use current time
    }

    // Save the updated appointment
    await appointment.save();

    // If the appointment is completed, update the patient's totalPrescriptions
    if (status === 'completed') {
      const patientId = appointment.patient;  // The patient ID is already stored in the appointment

      // Find the patient by ID and update their totalPrescriptions
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      // Increment the totalPrescriptions count
      patient.totalPrescriptions += 1;

      // Save the updated patient
      await patient.save();
    }

    res.status(200).json({ message: 'Appointment and patient updated successfully', appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// Get caregiver profile by ID
exports.getCaregiverProfile = async (req, res) => {
  const caregiverId = req.params.id;  // Assuming the ID is passed as a parameter
  console.log(caregiverId, "caregiver data")

  try {
    // Find the caregiver by ID
    const caregiver = await Caregiver.findById(caregiverId) // Populate the appointments if needed

    if (!caregiver) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }

    // Return caregiver profile data
    res.status(200).json(caregiver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
