const { addDriverLocation } = require('./location-service');
const driverRepository = require('../repositories/driver-repository');

const updateLocation = async (driverId, { latitude, longitude }) => {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    await addDriverLocation(driverId, lat, lon);
    await driverRepository.updateLocation(driverId, lat, lon);
};

module.exports = { updateLocation };
