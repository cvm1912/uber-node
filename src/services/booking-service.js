const bookingRepository = require('../repositories/booking-repository');
const { haversineDistance } = require('../utils/distance');

const BASIC_FARE = 50;
const RATE_PER_KM = 12;

const createBooking = async ({ passengerId, source, destination }) => {
    const distance = haversineDistance(
        source.latitude, source.longitude,
        destination.latitude, destination.longitude
    );

    const fare = BASIC_FARE + distance * RATE_PER_KM;

    return bookingRepository.createBooking({
        passenger: passengerId,
        source,
        destination,
        fare: Math.round(fare),
        status: 'pending',
        distance
    });
};

module.exports = { createBooking };
