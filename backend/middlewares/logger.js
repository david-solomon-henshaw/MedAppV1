// middlewares/logger.js
const Log = require('../models/Log');

const createLog = async (req, res, next) => {
  try {
    const {
      userId,
      userType,
      firstName,
      lastName,
      action,
      status,
      severity,
      details = ''
    } = req.logInfo; // Destructure from `req.logInfo`

    // Validate necessary fields to avoid empty log entries
    if (!userId || !userType || !firstName || !lastName || !action || !status || !severity) {
      console.error('Missing required log fields');
      return next();
    }

    // Create log entry
    await Log.create({
      userId,
      userType,
      firstName,
      lastName,
      action,
      status,
      severity,
      details
    });

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Logging error:', error); // Capture any logging errors
    next(); // Move on even if logging fails to prevent blocking
  }
};

module.exports = createLog;
