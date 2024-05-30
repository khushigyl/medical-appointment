// handles the registration and login
const User = require('../models/UserSchema')
const Doctor = require('../models/DoctorSchema')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const generateToken = (user) => {
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15d",
      }
    );
  };

async function register(req, res) {
    const { email, password, name, role, photo, gender } = req.body;
    try {
      let user = null;
      if (role === "patient") {
        user = await User.findOne({ email: email });
      } else if (role === "doctor") {
        user = await Doctor.findOne({ email: email });
      }
  
      //check if user exist
      if (user) {
        return res.status(400).json({ message: "User already exist" });
      }
  
      //hash password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
  
      if (role === "patient") {
        user = new User({
          name,
          email,
          password: hashPassword,
          photo,
          gender,
          role,
        });
      }
      if (role === "doctor") {
        user = new Doctor({
          name,
          email,
          password: hashPassword,
          photo,
          gender,
          role,
        });
      }
  
      await user.save();
  
      res
        .status(200)
        .json({ success: true, message: "User successfully created" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error, Try again" });
    }
  };


async function login(req, res) {
    const { email } = req.body;
  
    try {
      let user = null;
      // Determine user role and query the appropriate collection
      const patient = await User.findOne({ email: email });
      const doctor = await Doctor.findOne({ email: email });
  
      if (patient) {
        user = patient;
      }
      if (doctor) {
        user = doctor;
      }
    //   console.log(user);
      //Check if user exist or not
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Compare password
      const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
      // console.log(isPasswordMatch);
  
      if (!isPasswordMatch) {
        return res.status(400).json({
          status: false,
          message: "Invalid credentials",
        });
      }
  
      // Generate token
      const token = generateToken(user);
  
      const { password, role, appointments, ...rest } = user._doc; //not understood
      res.status(200).json({
        status: true,
        message: "Successfully Login",
        token,
        data: { ...rest },
        role,
      });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ status: false, message: "Failed to login" });
    }
  };



module.exports = {
  register,
  login,
};
