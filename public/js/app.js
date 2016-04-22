var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

console.log(name + ' ' + room);

jQuery('.room-title').text(room);

socket.on('connect', function () {
	console.log('connected to socket.io server from app.js');
	socket.emit('joinRoom', {
		name: name,
		room: room
	});
});
// recives the message and display it
socket.on('message', function (message) {
	var momentTimestamp = moment.utc(message.timestamp);	
	/*


	console.log('new message');
	console.log(message.text);
	jQuery('.messages').
	append('<h3>'+ message.name +'</h3><p>' + momentTimeStamp
	.local()
	.format('h:mm a') + message.text + '  '+'</p>');
*/

	var $messages = jQuery('.messages');
	var $message = jQuery('<li class="list-group-item"></li>');

	console.log('New message:');
	console.log(message.text);

	$message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
	$message.append('<p>' + message.text + '</p>');
	$messages.append($message);






});
// Handles submitting of new message
var $form = jQuery('#message-form');
// sends form data to server on its socket
$form.on('submit', function (event) {
	// to handle form submission on your own
	event.preventDefault();
	var $message = $form.find('input[name=message]');
	// send message to the server	
	socket.emit('message', {
		name: name,		
		text: $message.val()
	});
	$message.val('');
});