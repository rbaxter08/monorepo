import type { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';

type Data = {
  name: string;
};

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
      socket.on('disconnect', async () => {
        const newSockets = await io.fetchSockets();
        console.log('user disconnected', socket.id);
        socket.broadcast.emit(
          'users-updated',
          newSockets.map((socket) => socket.id)
        );
      });

      const sockets = await io.fetchSockets();
      console.log('user connected', socket.id);
      socket.broadcast.emit(
        'users-updated',
        sockets.map((socket) => socket.id)
      );
    });
  }

  res.end();
}
