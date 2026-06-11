const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    passenger:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'    
    },

    source:{
        latitude:{
            type:Number
        },
        longitude:{
            type:Number
        }

    },
    destination:{
        latitude:{
            type:Number
        },
        longitude:{
            type:Number
        }

    },

    fare:Number,

    distance:Number, 

    status:{
        type:String,
        enum:['pending','accepted','rejected','completed'],
        default:'pending'
    },

    rating:{
        type:Number
    },

    feedback:String


})

module.exports = mongoose.model('Booking', bookingSchema)