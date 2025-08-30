const nodemailer = require('nodemailer');
const ErrorResponse = require('./errorResponse');

// Development: Mock email sender
const devTransporter = {
  sendMail: () => Promise.resolve({ message: 'Email would be sent in production' })
};

// Production: Real email sender
const prodTransporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify connection in production
if (process.env.NODE_ENV === 'production') {
  prodTransporter.verify((error) => {
    if (error) {
      console.error('Email config error:', error.message);
    } else {
      console.log('Email server ready');
    }
  });
}

exports.sendEmail = async ({ email, subject, message }) => {
  const transporter = process.env.NODE_ENV === 'production' 
    ? prodTransporter 
    : devTransporter;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    text: message,
    html: `<p>${message}</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error('Email send failed:', err.message);
    throw new ErrorResponse('Email could not be sent', 500);
  }
};