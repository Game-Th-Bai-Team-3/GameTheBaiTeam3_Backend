// src/controllers/helloController.js
const { getHelloMessage } = require("../services/helloService.js");

const sayHello = (req, res) => {
  const message = getHelloMessage();
  res.json({ message });
};

module.exports = { sayHello };

