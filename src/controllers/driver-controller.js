const driverService = require('../services/driver-service');
const updateLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        await driverService.updateLocation(req.user.id, { latitude, longitude });
        res.status(200).json({ message: 'Location updated successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = { updateLocation };
