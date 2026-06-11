const express = require('express')
const router = express.Router()

 router.post('/location', updateLocation)
 router.get('/booking', getBookingDetails)
 
 
module.exports = router