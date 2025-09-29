import { API_CONFIG } from '../config/api';
import { WebSocketMessage } from '../types';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private messageCallback: ((message: WebSocketMessage) => void) | null = null;
  private disconnectCallback: (() => void) | null = null;
  
  connect(conversationId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const url = `${API_CONFIG.WS_URL}/chat/${conversationId}`;
        this.ws = new WebSocket(url);
        
        this.ws.onopen = () => resolve();
        this.ws.onerror = (event) => reject(event);
        
        this.ws.onmessage = (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data as string) as WebSocketMessage;
            if (this.messageCallback) this.messageCallback(data);
          } catch (_e) {
            // Ignore malformed messages
          }
        };
        
        this.ws.onclose = () => {
          if (this.disconnectCallback) this.disconnectCallback();
        };
      } catch (error) {
        reject(error);
      }
    });
  }
  
  disconnect(): void {
    if (this.ws) {
      try { this.ws.close(); } catch { /* noop */ }
      this.ws = null;
    }
  }
  
  sendMessage(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
      } catch {
        // ignore
      }
    }
  }
  
  onMessage(callback: (message: WebSocketMessage) => void): void {
    this.messageCallback = callback;
  }
  
  onDisconnect(callback: () => void): void {
    this.disconnectCallback = callback;
  }
}
// Singleton instance
export const websocketService = new WebSocketService();
