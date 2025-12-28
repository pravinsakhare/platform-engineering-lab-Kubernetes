const express = require("express");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
    <h2>Platform Engineering Lab 🚀</h2>
    <p>Status: Healthy</p>
    <p>Version: v1.0.0</p>
    <p>Environment: local</p>
    <p>Pod Name: ${os.hostname()}</p>
  `);
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/info", (req, res) => {
  res.json({
    status: "healthy",
    version: "v1.0.0",
    environment: "local",
    hostname: os.hostname(),
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
