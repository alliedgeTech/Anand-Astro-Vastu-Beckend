const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const cors = require('cors');
const { emailTemplate } = require('./email');
const oemail="anandastrotalk@gmail.com"
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();
// Set up Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


// Define routes

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'n03544571@gmail.com', // Replace with your email
    pass: 'krydprmexkdthpae' // Replace with your password (avoid storing in code)
  }
});

app.get('/', (req, res) => {
  res.send('Server is up and running');
});

app.post('/submit', async (req, res) => {
  console.log("this is got the req");
  
  // Read the email.html template (optional for client email)

  const mailOptionsToOwner = {
    from: req.body.email, // Replace with your email
    to: oemail, // Your email address (business owner)
    subject: 'New Inquiry Received',
    text: `A new inquiry has been received from:
            Name: ${req.body.name}
            Email: ${req.body.email}
            Mobile: ${req.body.mobile}
            Service: ${req.body.help}
            Note: ${req.body.note}`
  };

  const mailOptionsToClient = {
    from: oemail, // Replace with your email
    to: req.body.email, // User's email address (client)
    subject: 'Thank You for Your Inquiry',
    html: emailTemplate // Send the entire email template as HTML content (if available)
  };

  try {
    // Send email to business owner
    await transporter.sendMail(mailOptionsToOwner);
    console.log('Email to owner sent');

    // Send email to client (user)
    await transporter.sendMail(mailOptionsToClient);
    console.log('Email to client sent');

   res.send('success');
    // res.send('success');
  } catch (error) {
    console.error('Error:', error);
    res.send('error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
