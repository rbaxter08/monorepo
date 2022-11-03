import { useEffect, useMemo, useState } from 'react';
import io, { Socket } from 'Socket.IO-client';
import { Connection } from './models';

let socket: Socket | null = null;

export function useWebsocket() {
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      socket?.disconnect();
    });
  }, []);

  useEffect(() => {
    async function socketInitializer() {
      console.log('cons', socket?.id);
      if (!socket) {
        await fetch('/api/websocket');
        socket = io();

        socket.on('users-updated', (connections: Connection[]) => {
          setConnections(connections);
        });
      }
    }
    socketInitializer();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return useMemo(
    () => ({
      connections,
    }),
    [connections]
  );
}
