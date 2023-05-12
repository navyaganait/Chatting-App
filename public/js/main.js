const chatFrom=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');

// Get username and room from URL
const {username,room}=Qs.parse(location.search,{
	ignoreQueryPrefix:true
});
// console.log(username,room);
const socket=io();

// Join chat room
socket.emit('joinRoom',{username,room});

// get room and users
socket.on("roomUsers",({room,users})=>{
	outputRoomName(room);
	outputUsers(users);
})
// Message from server
socket.on('message',(message)=>{
	console.log(message);
	outputMessage(message);

	// Scroll down
	chatMessages.scrollTop=chatMessages.scrollHeight;


});

// Message submit
chatFrom.addEventListener('submit',(e)=>{
	e.preventDefault();

	// Get message text
	const msg=e.target.msg.value;

	// Emit message to server
	socket.emit('chatMessage',msg);

	// Clear input
	e.target.msg.value="";
	e.target.msg.focus();
})

// Output message to DOM

function outputMessage(message){
	const div=document.createElement('div');
	div.classList.add('message');
	div.innerHTML=`<p class="meta">${message.username} <sapn>${message.time}</sapn></p>
				<p class="text">${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);

	

}

// add room name to dom
function outputRoomName(room){
	roomName.innerText=room;
}

// add room name to dom
function outputUsers(users){
	userList.innerHTML=`${users.map(user=>`<li>${user.username}</li>`).join('')}`;
}