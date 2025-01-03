import { useWebSocket } from "../utility/WebSocketContext";
import { useRef, useState, useEffect } from "react";

export const Chatting = () => {
  const ws = useWebSocket(); // Get the shared WebSocket instance
  const inputRef = useRef();
  const [messages, setMessages] = useState<string[]>(["Hello from server!"]);

  useEffect(() => {
    if (!ws) return;
  
    // Listen to messages from the server
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data); // Parse incoming JSON
  
        if (data.type === "chat" && data.payload?.message) {
          setMessages((prev) => [...prev, `Server: ${data.payload.message}`]);
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };
  
    return () => {
      console.log("Leaving Chatting page.");
    };
  }, [ws]);
  

  const sendMessage = () => {
    if (inputRef.current?.value && ws) {
      const message = inputRef.current.value;

      // Add the sender's message to the messages array
      setMessages((prev) => [...prev, `You: ${message}`]);

      // Send the message to the server
      ws.send(
        JSON.stringify({
          type: "chat",
          payload: { message },
        })
      );
      // Clear the input field
      inputRef.current.value = "";
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-600 flex flex-col items-center gap-4 p-4">
      <div className="flex flex-col border p-4 rounded-md bg-white overflow-y-scroll max-w-md max-h-96 w-full">
        {messages.map((msg, index) => (
          <div key={index} className="p-1 border-b">
            {msg}
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        placeholder="Enter message"
        className="font-medium text-green-800 max-h-10 border px-2 py-1 border-gray-700 rounded-xl w-full"
      />
      <button
        onClick={sendMessage}
        className="bg-red-500 border rounded-xl max-h-10 px-4 py-1 w-full mt-2"
      >
        Send
      </button>
    </div>
  );
};
