const jwt = require("jsonwebtoken");
const Doctor = require("../models/DoctorSchema");
const User = require("../models/UserSchema");

async function authenticate(req, res, next) {
  //get token from headers
  const authToken = req.headers.authorization;

  //check token is exist
  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }
  try {
    console.log(authToken);
    const token = authToken.split(" ")[1];

    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.userId = decoded.id;
    req.role = decoded.role;

    next(); //must be call the next fn
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    // console.log(error);
    return res.status(401).json({ success: false, message: "invalid token" });
  }
}

function restrict(roles) {
  return async function (req, res, next) {
    const userId = req.userId;

    let user;

    const patient = await User.findById(userId);
    const doctor = await Doctor.findById(userId);

    if (patient) {
      user = patient;
    }
    if (doctor) {
      user = doctor;
    }

    // console.log(user);
    if (!roles.includes(user.role)) {
      return res
        .status(401)
        .json({ success: false, message: "You are not authorized" });
    }
    next();
  };
}

module.exports = {
  authenticate,
  restrict,
};
