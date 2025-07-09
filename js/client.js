const socket = io('https://ichat-1-dzg0.onrender.com', {transports: ["websocket"]});

//Get DOM elements in respective JS variables
// document.getElementById is used to get the element by its ID

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")

//Audio that will play on receiving a message
// Create a new Audio object with the path to the sound file
var audio = new Audio('sound.mp3');

//Function which will append event info to the message container
// messageContainer is the div where messages will be displayed

const append = (message, position)=>{

    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}

//Ask the user for their name and let the server know
// prompt is a method that displays a dialog box asking the user for input

const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

//If a new user joins, append the info to the message container
// 'user-joined' is the event name, name is the data sent by the server

socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'right')

})

//If a new message is received, append it to the message container
// 'receive' is the event name, data is the data sent by the server

socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left')
})
//If a user leaves the chat, append the info to the message container
// 'left' is the event name, name is the data sent by the server

socket.on('left', name =>{
    append(`${name} left the chat`, 'left')
})

// Add an event listener to the form for the 'submit' event
// When the form is submitted, prevent the default action and send the message

form.addEventListener('submit', (e)=>{

    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''
})