const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 5005;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("🔮 Traveler connected:", socket.id);

  // Join a hall (channel)
  socket.on("join-hall", (hallId) => {
    socket.join(hallId);
    console.log(`👤 ${socket.id} joined hall: ${hallId}`);
  });

  // Leave a hall
  socket.on("leave-hall", (hallId) => {
    socket.leave(hallId);
    console.log(`👤 ${socket.id} left hall: ${hallId}`);
  });

  // Send scroll (message)
  socket.on("send-scroll", (data) => {
    // Broadcast to everyone in the hall except sender
    socket.to(data.hallId).emit("receive-scroll", data.scroll);
  });

  // Typing indicator
  socket.on("typing", (data) => {
    socket.to(data.hallId).emit("user-typing", {
      oderId: data.oderId,
      name: data.name,
    });
  });

  // Stop typing
  socket.on("stop-typing", (data) => {
    socket.to(data.hallId).emit("user-stop-typing", {
      oderId: data.oderId,
    });
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("🚪 Traveler disconnected:", socket.id);
  });
});

// Make io accessible to routes
app.set("io", io);

server.listen(PORT, () => {
  console.log(`🔮 Palantír server listening on http://localhost:${PORT}`);
});