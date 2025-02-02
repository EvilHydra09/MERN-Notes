const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

// ✅ Apply Middleware Before Routes
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses form-data
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

// Import Routes
const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./routes/authRoutes");

// Use Routes
app.use("/api/notes", noteRoutes);
app.use("/api/auth", authRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));