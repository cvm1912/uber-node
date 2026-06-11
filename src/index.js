const express = require('express')
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db.config');
const authRoutes = require('./routes/auth-routes');
const passengerRoutes = require('./routes/passenger-routes');

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/passenger', passengerRoutes);

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
