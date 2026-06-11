const bookingService = require('../services/booking-service');

const createBooking = async(req,res)=>{
    try{
        const {source,destination} = req.body;
        const booking = await bookingService.createBooking({
            passengerId : req.user.id,
            source,
            destination
        });
        res.status(201).json(booking);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports = { createBooking };