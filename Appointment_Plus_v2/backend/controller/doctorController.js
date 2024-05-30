const Doctor = require("../models/DoctorSchema");
const Booking = require("../models/BookingSchema");
const bcrypt = require('bcrypt');

async function updateDoctor(req, res) {
  const id = req.params.id;
  try {
    let body = req.body;
    const salt = await bcrypt.genSalt(10)
    body.password = await bcrypt.hash(body.password, salt);
    
    const updateDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updateDoctor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "failed to updated" });
  }
}

async function deleteDoctor(req, res) {
  const id = req.params.id;
  try {
    await Doctor.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "failed to delete" });
  }
}

async function getSingleDoctor(req, res) {
  const id = req.params.id;
  try {
    const doctor = await Doctor.findById(id)
      .populate("reviews")
      .select("-password");

    res.status(200).json({
      success: true,
      message: "user found",
      data: doctor,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: "No user found" });
  }
}

async function getAllDoctor(req, res) {
  try {
    const { query } = req.query;
    let doctors;

    if (query) {
      doctors = await Doctor.find({
        isApproved: "approved",
        $or: [
          { name: { $regex: query, $options: "i" } }, // for the case sensitive
          { specialization: { $regex: query, $options: "i" } },
        ],
      }).select("-password");
    } else {
      doctors = await Doctor.find({ isApproved: "approved" }).select(
        "-password"
      );
    }

    res.status(200).json({
      success: true,
      message: "users found",
      data: doctors,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: "Not found" });
  }
}

async function getDoctorProfile(req, res) {
  const doctorId = req.userId;
  try {
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const { password, ...rest } = doctor._doc;
    const appointments = await Booking.find({ doctor: doctorId });

    res.status(200).json({
      success: true,
      message: "profile info is getting",
      data: { ...rest, appointments },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Something Went wrong, can not get" });
  }
}

module.exports = {
  updateDoctor,
  deleteDoctor,
  getSingleDoctor,
  getAllDoctor,
  getDoctorProfile,
};
