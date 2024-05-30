// import express from 'express'
const express = require("express");
// import {authenticate} from './../auth/verifyToken.js'
const {authenticate} = require('../auth/verifyToken.js')
// import { getCheckoutSession } from '../controller/bookingController.js'
const {getCheckoutSession} = require('../controller/bookingController.js')

const router = express.Router()

router.post('/checkout-session/:doctorId',authenticate, getCheckoutSession);

// export default router;
module.exports = router