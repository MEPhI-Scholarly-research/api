import WebSocket from 'ws';

function answerProcess(socket: WebSocket) {
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

function socketIIFE(socket: WebSocket.Server<WebSocket>) {
  socket.on('connection', answerProcess);
}

export default socketIIFE