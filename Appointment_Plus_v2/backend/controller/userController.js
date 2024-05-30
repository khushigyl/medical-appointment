const User = require("../models/UserSchema");
const Booking = require("../models/BookingSchema");
const Doctor = require("../models/DoctorSchema");
const bcrypt = require('bcrypt');


async function updateUser(req, res) {
  const id = req.params.id;
  const body = req.body;
  
  try {
    const salt = await bcrypt.genSalt(10)
    body.password = await bcrypt.hash(body.password, salt)
    const updateUser = await User.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updateUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "failed to updated" });
  }
}

async function deleteUser(req, res) {
  const id = req.params.id;
  try {
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "failed to delete" });
  }
}

async function getSingleUser(req, res) {
  const id = req.params.id;
  try {
    const user = await User.findById(id).select("-password");

    res.status(200).json({
      success: true,
      message: "user found",
      data: user,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: "No user found" });
  }
}

async function getAllUser(req, res) {
  try {
    const users = await User.find({}).select("-password");

    res.status(200).json({
      success: true,
      message: "users found",
      data: users,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: "Not found" });
  }
}

async function getUserProfile(req, res) {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { password, ...rest } = user._doc;

    res.status(200).json({
      success: true,
      message: "profile info is getting",
      data: { ...rest },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Something Went wrong, can not get" });
  }
}

async function getMyAppointments(req, res) {
  try {
    // step1 : retrieve appointments from booking for specific user
    const bookings = await Booking.find({ user: req.userId });

    // step2 : retrieve doctos ids from appointments bookings
    const doctorIds = bookings.map((el) => el.doctor.id);

    // step3 : retrieve doctos using ids
    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      message: "Appointment are getting",
      data: doctors,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Something Went wrong, can not get" });
  }
}

module.exports = {
  updateUser,
  deleteUser,
  getSingleUser,
  getAllUser,
  getUserProfile,
  getMyAppointments,
};
