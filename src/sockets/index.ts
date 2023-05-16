import { quizProcess } from '@/sockets/quiz'

function socketIIFE(socket: any) {
  socket.on('connection', quizProcess);
}

export default socketIIFE