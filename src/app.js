// src/app.js
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Swagger
const { swaggerUi, swaggerSpec } = require('./utils/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route test
app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

module.exports = app;

// Import và sử dụng các routes
const helloRoutes = require('./routes/helloRoutes');
app.use('/', helloRoutes);
