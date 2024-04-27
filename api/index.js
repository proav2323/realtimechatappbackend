const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

app.get("/", (req, res) => {
  res.send("Welcome");
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

httpServer.listen(3000, () => {
  console.log("listening on port 3000");
});
