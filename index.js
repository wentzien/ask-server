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

    socket.on("join", async (event) => {

        const data = await db.all(event.id);

        socket.emit("questions", data);

        socket.join(event.id);

    });

    socket.on("newQuestion", async (question) => {
        const result = await db.insert(question);
        console.log(result);

        const data = await db.all(question.event_id);

        io.to(question.event_id).emit("questions", data);
    });

    socket.on("vote", async (question) => {
        const result = await db.incrementVote(question.id);
        console.log(result);

        const data = await db.all(question.event_id);

        io.to(question.event_id).emit("questions", data);
    });

    socket.on("disconnect", () => {
        console.log("user left");
    });
});

app.use("/questions", questionRouter);

// Port
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`App listening on port ${port}...)`));
