// Node Server which will handle socket io connections

// Import necessary modules
const http = require('http'); // You need http module to create a server
const socketIO = require('socket.io'); // Renamed to avoid conflict if you use 'io' for instance

// Define the port to listen on.
// Use process.env.PORT for deployment, and a fallback (e.g., 8000) for local development.
const PORT = process.env.PORT || 8000;

// Create an HTTP server (Socket.IO needs an HTTP server to attach to)
const server = http.createServer((req, res) => {
    // You can add basic HTTP response for the root URL if needed
    // For example, to just show "Server is running" on the root path
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Socket.IO server is running!');
    } else {
        res.writeHead(404);
        res.end();
    }
});

// Attach Socket.IO to the HTTP server
const io = socketIO(server); // Pass the HTTP server instance here

const users = {};

io.on('connection', socket => {
    //If any user joins, let other users connected to the server know
    socket.on('new-user-joined', name => {
        // console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    //If any user sends a message, broadcast it to other users
    // 'send' is the event name, message is the data sent by the client
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
    });

    //If a user leaves the chat, let other users connected to the server know
    socket.on('disconnect', () => { // No 'message' parameter needed here for 'disconnect'
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

// Start the HTTP server to listen on the defined port
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} (or on Vercel's assigned port)`);
});