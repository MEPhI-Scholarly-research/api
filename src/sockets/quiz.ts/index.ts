import WebSocket from 'ws';

function quizProcess(socket: WebSocket) {
  var uuid = ''

  console.log('A new WebSocket connection was established');

  socket.on('message', (message: WebSocket.Data) => {
    const body = JSON.parse(message as string);
    if (body.type == "connection") {
      uuid = body.uuid
    } else {
      console.log(uuid)
    }
  });

  socket.on('close', () => {
    console.log(`WebSocket connection with uuid '${uuid}' closed`);
  });
}