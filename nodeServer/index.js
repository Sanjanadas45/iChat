// Node Server which will handle socket io connections
const PORT = process.env.PORT || 8000;
const io = require('socket.io')(PORT)

const users = {};

io.on('connection', socket =>{

    //If any user joins, let other users connected to the server know
    socket.on('new-user-joined', name =>{
        // console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    //If any user sends a message, broadcast it to other users
    // 'send' is the event name, message is the data sent by the client
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    //If a user leaves the chat, let other users connected to the server know
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})