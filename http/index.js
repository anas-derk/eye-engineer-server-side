const routes = require("../routes");
const middlewares = require("../middlewares/core");
const express = require("express");
const app = express();

app.set("x-powered-by", false);

app.set("trust proxy", true);

// Handle Middlewares
app.use(middlewares);

// Handle Routes
app.use(routes);

module.exports = app;