const User = require('../model/User');

const updateLocation = async (driverId, latitude, longitude) => await User.findByIdAndUpdate(driverId, {
    location: { type: 'Point', coordinates: [longitude, latitude] }
});

module.exports = { updateLocation };
