const { redisClient } = require('../utils/redis-client');

const addDriverLocation = async (driverId, latitude, longitude) => {
    await redisClient.sendCommand(['GEOADD', 'drivers', longitude.toString(), latitude.toString(), driverId]);
};

const findNearbyDrivers = async (latitude, longitude, radius = 5) => {
    const nearbyDrivers = await redisClient.sendCommand([
      'GEORADIUS', 
      'drivers', 
      longitude.toString(), 
      latitude.toString(), 
      radius.toString(), 
      'km', 
      'WITHDIST'
    ]);

    return nearbyDrivers;
};

module.exports = { addDriverLocation, findNearbyDrivers };
