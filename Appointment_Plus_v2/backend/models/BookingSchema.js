const mongoose = require("mongoose");

const { Schema } = mongoose;

const bookingSchema = new Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticketPrice: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

bookingSchema.pre(/^find/, function(next){
  this.populate('user').populate({
    path:'doctor', 
    select:'name'
  })
  next();
})

module.exports = mongoose.model("Booking", bookingSchema);