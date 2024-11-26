const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const { emailTemplate } = require('./email');
require("dotenv").config();

// const oemail = "anandastrotalk@gmail.com";
const PORT = process.env.PORT || 5000;

const app = express();

// Set up Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "n03544571@gmail.com",
    pass: "krydprmexkdthpae", 
  },
});

app.get('/', (req, res) => {
  res.send('Server is up and running');
});

app.post('/submit', async (req, res) => {
  console.log("Request received");

  const mailOptionsToOwner = {
    from: req.body.email, 
    to: "n03544571@gmail.com", 
    subject: 'New Inquiry Received',
    text: `A new inquiry has been received from:
            Name: ${req.body.name}
            Email: ${req.body.email}
            Mobile: ${req.body.mobile}
            Service: ${req.body.help}
            Note: ${req.body.note}`
  };

  const mailOptionsToClient = {
    from: oemail, 
    to: req.body.email, 
    subject: 'Thank You for Your Inquiry',
    html: emailTemplate() // Ensure emailTemplate() returns valid HTML
  };

  try {
    // Send email to business owner
    await transporter.sendMail(mailOptionsToOwner);
    console.log('Email to owner sent');

    // Send email to client (user)
    await transporter.sendMail(mailOptionsToClient);
    console.log('Email to client sent');

    res.send('success');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
