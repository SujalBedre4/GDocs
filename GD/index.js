const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');

// import Connnection from "./Database/db.js"
const Connection = require('./Database/db')

const app = express();
const server = http.createServer(app);
const PORT = 4500;
// Here, we are calling the connection() for connecting to the database.
Connection()

const Schema = require('./Schema/DocumentSchema')

// Here, we are importing the Controller of the project.

const getDoc = require('./Controller/DocumentController')

// Here, we are saving the doc:
const updateDocument = require('./Controller/DocumentController');


const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true
    }
});

app.use(cors({
    origin: "http://localhost:5173"
}));

io.on('connection', (socket) => {
    console.log("User connected");

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });

    // Here, we are comparing the document ID and if that is true. Then we will only done chnage in that particular ID's.

    socket.on('get-document', documentID => {
        const document = getDoc(documentID)

        // Here, we are saving the data in the Doc.

        socket.on("send-changes", (delta) => {

            socket.broadcast.to(documentID).emit('receive-changes', delta);
        });

        socket.on('save-document', async data => {
            const doc = await updateDocument(documentID, data)
            socket.join(documentID)
            socket.emit('load-document', document.data)
        })
    })
});

server.listen(PORT, (err) => {
    if (err) {
        console.error("Error found", err);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});
