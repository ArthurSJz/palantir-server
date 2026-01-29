// ℹ️ Gets access to environment variables/settings
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests
const express = require("express");
const app = express();

// ℹ️ This function is getting exported from the config folder
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const realmRoutes = require("./routes/realm.routes");
app.use("/api/realms", realmRoutes);

const hallRoutes = require("./routes/hall.routes");
app.use("/api/halls", hallRoutes);

const scrollRoutes = require("./routes/scroll.routes");
app.use("/api/scrolls", scrollRoutes);

const gandalfRoutes = require("./routes/gandalf.routes");
app.use("/api/gandalf", gandalfRoutes);

// ❗ To handle errors
require("./error-handling")(app);

module.exports = app;