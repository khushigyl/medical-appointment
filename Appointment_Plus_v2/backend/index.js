// import bookingRoute from './Routes/booking.js'

const express = require("express");
const cors = require("cors");
const dbConnect = require("./db/db");
const authRoute = require("./Routes/auth");
const userRoute = require("./Routes/user");
const doctorRoute = require("./Routes/doctor");
const reviewRoute = require("./Routes/review");
const bookingRoute = require("./Routes/booking")
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/auth',authRoute)
app.use('/api/v1/users',userRoute)
app.use('/api/v1/doctors',doctorRoute)
app.use('/api/v1/reviews',reviewRoute)
app.use('/api/v1/bookings',bookingRoute)

app.get("/", (req, res) => {
  res.send("<h1>REST API</h1>");
});

dbConnect();

app.listen(PORT, () => console.log("http://localhost:5000"));
