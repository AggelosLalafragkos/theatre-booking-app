const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { register, login } = require('./controllers/authController');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/register', register);
app.post('/login', login);
app.use('/theatres', require('./routes/theatres'));
app.use('/shows', require('./routes/shows'));
app.use('/showtimes', require('./routes/showtimes'));
app.use('/reservations', require('./routes/reservations'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Theatre server running on port ${PORT}`));