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

  socket.on("join", async (event, callback) => {

    const data = await db.all(event.id);

    socket.join(event.id);
    socket.send("questions", data);

    callback(data);
  });

  socket.on("newQuestion", async (question, callback) => {
    const result = await db.insert(question);
    console.log(result);

    const data = await db.all(question.event_id);

    io.to(question.event_id).emit("questions", data);
    
    callback();
  });

  socket.on("newVote", async (id, callback) => {
    // wichtig, auch die event id übergeben, also eig. die ganze Frage
    const result = await db.incrementVote(id);
    console.log(result);

    const data = await db.all(question.event_id);

    io.to(question.event_id).emit("questions", data);

    callback();
  });

  socket.on("disconnect", () => {
    console.log("user left");
  });
});

app.use("/questions", questionRouter);

// Port
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`App listening on port ${port}...)`));
