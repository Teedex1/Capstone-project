const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes'); // Import task routes

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected'))
    .catch((error) => console.error('Database connection error:', error));

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Task Management API is running!' });
});

// Use Routes
app.use('/auth', authRoutes);
app.use('/api/tasks', taskRoutes); // Add task routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
