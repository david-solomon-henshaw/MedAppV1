const Admin = require('../models/admin');
const Patient = require('../models/patient');
const Caregiver = require('../models/caregiver')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateOtp = require('./generateOtp');
const transporter = require('../config/nodemailerConfig');

// Unified login function
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)
  

  try {
    let user;
    let role;

    // Check if the user is an admin
    user = await Admin.findOne({ email });
    role = 'admin';


 
    if (!user) {
    //  If not admin, check if the user is a patient
      user = await Patient.findOne({ email });
      role = 'patient';

    }
    // Check if the user is a caregiver if not found as admin or patient
    if (!user) {
      user = await Caregiver.findOne({ email });
      role = 'caregiver';
    console.log(user, "user after caregiver checks in database")

    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    await user.save();

    const htmlContent =
      ` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
            <h2 style="color: #4CAF50; text-align: center;">OTP Verification</h2>
            <p style="font-size: 16px; color: #333;">
                Hello, please use the following OTP to complete your login:
            </p>
            <div style="text-align: center; padding: 10px;">
                <p style="font-size: 24px; font-weight: bold; color: #333;">${otp}</p>
            </div>
            <p style="font-size: 14px; color: #555;">
                This OTP is valid for a short time. If you didn't request this, please ignore this email or contact support.
            </p>
            <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
                Thank you for using eMed!<br>
                The eMed Team
            </p>
        </div> `
      ;

    const info = await transporter.sendMail({
      from: 'Emed',
      to: user.email,
      subject: 'Your OTP Code',
      html: htmlContent,
    });

    res.status(200).json({ message: 'OTP sent to email', role });

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error logging in', error });
  } 
};
 
// OTP Verification
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  // Check which type of user and validate OTP
  let user = await Admin.findOne({ email }) || await Patient.findOne({ email }) || await Caregiver.findOne({email});

  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!user.otp || !user.otpExpiresAt) {
    return res.status(400).json({ message: 'No OTP request found. Please request a new OTP.' });
  }

  const isOtpExpired = Date.now() > user.otpExpiresAt;
  const isOtpValid = user.otp === otp;

  if (!isOtpValid || isOtpExpired) {
    return res.status(400).json({ message: isOtpExpired ? 'OTP has expired' : 'Invalid OTP' });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  user.otp = undefined; // Clear OTP
  user.otpExpiresAt = undefined; // Clear expiry
  await user.save();

  res.status(200).json({ message: 'OTP verified successfully', token });
};
