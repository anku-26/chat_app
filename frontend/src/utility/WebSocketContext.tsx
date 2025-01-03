import React, { createContext, useContext, useRef, useEffect } from "react";

const WebSocketContext = createContext<WebSocket | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:8080");
    console.log("WebSocket connected");

    wsRef.current.onopen = () => console.log("WebSocket connection established");
    wsRef.current.onclose = () => console.log("WebSocket connection closed");

    return () => {
      wsRef.current?.close();
    };
  }, []);

  return <WebSocketContext.Provider value={wsRef.current}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
