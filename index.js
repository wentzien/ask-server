const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");
const app = express();

const server = http.createServer(app);
const io = socketio(server);

const questionRouter = require("./routes/questions");
const db = require("./db/mysql");

app.use(cors());

app.use(express.json());

io.on("connection", (socket) => {
  console.log("new connection");

  socket.on('join', async (id, callback) => {

    const data = await db.all(id.id);

    callback(data);
  });

  socket.on("disconnect", () => {
    console.log("user left");
  });
});

app.use("/questions", questionRouter);

// Port
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`App listening on port ${port}...)`));
