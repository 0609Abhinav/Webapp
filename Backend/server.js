const express = require('express');
const cors = require('cors');
const stateRoutes = require('./routes/stateRoutes');
const userRoutes = require('./routes/userRoutes');
const recordRoutes = require('./routes/recordRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images
app.use('/uploads', express.static('uploads'));

app.use('/api/states', stateRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);

app.listen(3002, () => console.log('Backend running on port 3002'));