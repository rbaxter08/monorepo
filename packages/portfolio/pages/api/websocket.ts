import type { NextApiRequest, NextApiResponse } from 'next';
import { Server, Socket } from 'socket.io';
import { Connection } from '../../src/models';

type Data = {
  name: string;
};

function getRandomColor() {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor}`;
}

async function getConnections(io: Server): Promise<Array<Connection>> {
  const sockets = await io.fetchSockets();
  return sockets.map((socket) => ({ id: socket.id, color: socket.data.color }));
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // @ts-ignore
  if (res.socket && res.socket.server && res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    // @ts-ignore
    const io = new Server(res.socket.server);
    // @ts-ignore
    res.socket.server.io = io;

    io.on('connection', async (socket) => {
      console.log('user connected', socket.id);
      socket.data.color = getRandomColor();

      // broadcast updated user list
      const connections = await getConnections(io);
      socket.broadcast.emit('users-updated', connections);

      socket.on('disconnect', async () => {
        console.log('user disconnected', socket.id);

        // broadcast updated user list
        const connections = await getConnections(io);
        socket.broadcast.emit('users-updated', connections);
      });
    });
  }

  res.end();
}
