// thired party services ka code is folder me ata hai 
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail,name){
    const subject = "Welcome to Backend Ledger !";
    const text = `Hello ${name},
    Thank you for registering with us. We're excited to have you on board!
    
    Best regards,
    The Backend Ledger Team`;
    const html = `<p>Hello <strong>${name}</strong>,</p>
    <p>Thank you for registering with us. We're excited to have you on board!</p>
    <p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail,name,amount,toAccount){
  const subject = "Transaction Alert from Backend Ledger";
  const text = `Hello ${name},
  A transaction of $${amount} has been made to account ${toAccount}.        
Best regards,
The Backend Ledger Team`;
  const html = `<p>Hello <strong>${name}</strong>,</p>
  <p>A transaction of <strong>$${amount}</strong> has been made to account <strong>${toAccount}</strong>.</p>
  <p>Best regards,<br>The Backend Ledger Team</p>`;     
   
  await sendEmail(userEmail, subject, text, html);

}


async function sendTransactionFailedEmail(userEmail,name,amount,toAccount){
  const subject = "Transaction Failed Alert from Backend Ledger";
  const text = `Hello ${name},    
  A transaction of $${amount} to account ${toAccount} has failed. Please check your account for more details.      
Best regards,
The Backend Ledger Team`;
const html = `<p>Hello <strong>${name}</strong>,</p>    
  <p>A transaction of <strong>$${amount}</strong> to account <strong>${toAccount}</strong> has failed. Please check your account for more details.</p>
  <p>Best regards,<br>The Backend Ledger Team</p>`;
  
  await sendEmail(userEmail, subject, text, html);
}

module.exports = { sendRegistrationEmail, sendTransactionEmail, sendTransactionFailedEmail };