"use client";
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { io,Socket } from 'socket.io-client';

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (message: string) => any;
  messages: string[];
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error("State is undefined");
  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage: ISocketContext['sendMessage'] = useCallback((msg) => {
    if (socket) {
      socket.emit('event:message', {message : msg});  // Emit the message to the server
      console.log("Message sent:", msg);
    }
  }, [socket]);

  const onMessageRec = useCallback( (msg: string) => {
    console.log("From server msg received:", msg);
    const {message} = JSON.parse(msg) as { message: string };
    setMessages((prev) => [...prev, message]);
  }, []);

  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    newSocket.on('message', onMessageRec);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      newSocket.off('message', onMessageRec);
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
