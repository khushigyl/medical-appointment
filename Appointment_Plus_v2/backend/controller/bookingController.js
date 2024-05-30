// import User from '../models/UserSchema.js'
const User = require('../models/UserSchema.js')
// import Doctor from '../models/DoctorSchema.js'
const Doctor = require('../models/DoctorSchema.js')
// import Booking from '../models/BookingSchema.js'
const Booking = require('../models/BookingSchema.js')
// import Stripe from 'stripe'
const Stripe = require('stripe')

const getCheckoutSession = async(req,res)=>{
    try{
        // get currently booked doctor
        const doctor = await Doctor.findById(req.params.doctorId)
        const user = await User.findById(req.userId)
        const stripe = new Stripe("sk_test_51PGpfRSFAZxpFHJCRExeyX9s6GfK3fhePiWp7mhGCi6bUqE38HBDuaHGn4TGsSFsZR37Xib6LsGXVcBvbEZkWd3J004uUR2jNj")

        // create stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`,
            cancel_url:`${req.protocol}://${req.get('host')}/doctors/${doctor.id}`,
            customer_email: user.email,
            client_reference_id: req.params.doctorId,
            line_items:[
                {
                    price_data:{
                        currency:'bdt',
                        unit_amount: parseInt(doctor.ticketPrice) * 100,
                        product_data:{
                            name:doctor.name,
                            description:doctor.bio,
                            images:[doctor.photo]
                        }
                    },
                    quantity:1
                }
            ]
        })


        // create new boooking
        const booking = new Booking({
            doctor:doctor._id,
            user:user._id,
            ticketPrice:doctor.ticketPrice,
            session:session.id
        })

        await booking.save()

        res.status(200).json({success:true, message:'Successfully paid', session})
    }catch(error){
        console.log(error);
        res.status(500).json({success: false, message:'Error creating checkout session'})
        
    }
}

module.exports={
    getCheckoutSession
}