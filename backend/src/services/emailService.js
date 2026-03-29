import dotenv from 'dotenv';
dotenv.config();

export const sendEmail = async ({ to, subject, html }) => {
  const msg = {
    to,
    from: {
      email: process.env.FROM_EMAIL || 'noreply@nrcinnovatex.com',
      name: process.env.FROM_NAME || 'NRC INNOVATE-X',
    },
    subject,
    html,
  };

  try {
    // DUMMY EMAIL SERVICE - Just log to console instead of sending
    console.log('\n=================== DUMMY EMAIL SENT ===================');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${html}`);
    console.log('========================================================\n');
  } catch (error) {
    console.error('Email sending error:', error);
  }
};
