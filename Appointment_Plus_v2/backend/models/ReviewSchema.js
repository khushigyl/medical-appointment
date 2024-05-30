const mongoose = require("mongoose");
const Doctor= require("../models/DoctorSchema")

const reviewSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

//below function is used to populate user info in the review 
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo", // add name & photo to the review document
  });

  next(); // coz this one is middleware
});

//below function is used to calculate average rating
reviewSchema.statics.calcAverageRatings = async function (doctorId) {
  
  //this points the current review 
  const stats = await this.aggregate([
    {
      $match: { doctor: doctorId }, // review associated with specific doctor 
    },
    {
      $group: { //grp the review of a specific doctor 
        _id: "$doctor",
        numOfRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  await Doctor.findByIdAndUpdate(doctorId, {
    totalRating: stats[0].numOfRating,
    averageRating: stats[0].avgRating,
  });

  console.log(stats);
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.doctor);
});

module.exports = mongoose.model("Review", reviewSchema);
