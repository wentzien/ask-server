const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");
const app = express();

const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(express.json());

const questionRouter = require("./routes/questions");
const eventRouter = require("./routes/events");
const db = require("./db/mysql");

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

        socket.emit("newQuestionResult", result);
        io.to(question.event_id).emit("questions", data);
    });

    socket.on("vote", async (question) => {
        const result = await db.incrementVote(question.id);

        const data = await db.all(question.event_id);

        io.to(question.event_id).emit("questions", data);
    });

    socket.on("delete", async (question) => {
        const result = await db.delete(question.id);

        const data = await db.all(question.event_id);

        io.to(question.event_id).emit("questions", data);

    });

    socket.on("answered", async (question) => {
        const result = await db.answered(question.id);

        const data = await db.all(question.event_id);

        io.to(question.event_id).emit("questions", data);
    });

    socket.on("disconnect", () => {
        console.log("user left");
    });
});

app.use("/questions", questionRouter);
app.use("/events", eventRouter);

// Port
const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`App listening on port ${port}...)`));
