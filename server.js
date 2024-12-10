const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const { emailTemplate } = require("./email");
require("dotenv").config();

const oemail = process.env.OWNER_EMAIL; // Owner email should be in env variable
const PORT = process.env.PORT || 5000;

const app = express();

// Set up Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Set up transporter with Gmail and environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Store email in env variable
    pass: process.env.GMAIL_PASS, // Store email password in env variable
  },
});

app.get("/", (req, res) => {
  res.send("Server is up and running");
});

app.post("/submit", async (req, res) => {
  // Validate incoming data
  const { name, email, mobile, Service, note } = req.body;
  if (!email || !name || !mobile || !Service || !note) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Mail options for the owner (business)
  const mailOptionsToOwner = {
    from: email,
    to: oemail, // Use the owner's email
    subject: "New Inquiry Received",
    text: `A new inquiry has been received from:
            Name: ${name}
            Email: ${email}
            Mobile: ${mobile}
            Service: ${Service}
            Note: ${note}`,
  };

  // Mail options for the client (user)
  const mailOptionsToClient = {
    from: oemail,
    to: email, // Ensure this is the correct recipient (the client)
    subject: "Thank You for Your Inquiry",
    html: emailTemplate(), // Ensure emailTemplate() returns valid HTML
  };

  try {
    // Send email to business owner
    await transporter.sendMail(mailOptionsToOwner);
    console.log("Email to owner sent");
    // Send email to client (user)
    await transporter.sendMail(mailOptionsToClient);
    console.log("Email to client sent");
    res.status(200).json({
      message: "Inquiry received successfully.",
      status: "success",
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Error sending email", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
