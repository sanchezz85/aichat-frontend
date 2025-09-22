import { useEffect, useRef, useState, useCallback } from 'react';
import { websocketService } from '../services/websocket';
import { WebSocketMessage } from '../types';

export const useWebSocket = (conversationId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const messageHandlersRef = useRef<((message: WebSocketMessage) => void)[]>([]);

  // Connect to WebSocket
  useEffect(() => {
    if (!conversationId) return;

    const connect = async () => {
      try {
        setConnectionError(null);
        await websocketService.connect(conversationId);
        setIsConnected(true);

        // Set up message handler
        websocketService.onMessage((message: WebSocketMessage) => {
          messageHandlersRef.current.forEach(handler => handler(message));
        });

        // Set up disconnect handler
        websocketService.onDisconnect(() => {
          setIsConnected(false);
        });

      } catch (error) {
        console.error('WebSocket connection failed:', error);
        setConnectionError(error instanceof Error ? error.message : 'Connection failed');
        setIsConnected(false);
      }
    };

    connect();

    return () => {
      websocketService.disconnect();
      setIsConnected(false);
    };
  }, [conversationId]);

  // Send message function
  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (isConnected) {
      websocketService.sendMessage(message);
    } else {
      console.warn('WebSocket not connected, message not sent');
    }
  }, [isConnected]);

  // Subscribe to messages
  const onMessage = useCallback((handler: (message: WebSocketMessage) => void) => {
    messageHandlersRef.current.push(handler);
    
    // Return cleanup function
    return () => {
      const index = messageHandlersRef.current.indexOf(handler);
      if (index > -1) {
        messageHandlersRef.current.splice(index, 1);
      }
    };
  }, []);

  return {
    isConnected,
    connectionError,
    sendMessage,
    onMessage
  };
};

