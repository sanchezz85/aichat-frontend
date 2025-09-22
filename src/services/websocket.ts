import { API_CONFIG, MOCK_MODE } from '../config/api';
import { WebSocketMessage } from '../types';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private mockSocket: MockWebSocket | null = null;
  private messageCallback: ((message: WebSocketMessage) => void) | null = null;
  private disconnectCallback: (() => void) | null = null;
  
  connect(conversationId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (MOCK_MODE) {
        this.mockSocket = new MockWebSocket(conversationId);
        // Bridge mock to callbacks
        this.mockSocket.onMessage((msg) => this.messageCallback && this.messageCallback(msg));
        this.mockSocket.onDisconnect(() => this.disconnectCallback && this.disconnectCallback());
        resolve();
        return;
      }
      
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
    if (this.mockSocket) {
      this.mockSocket.disconnect();
      this.mockSocket = null;
    }
  }
  
  sendMessage(message: WebSocketMessage): void {
    if (MOCK_MODE && this.mockSocket) {
      this.mockSocket.send(message);
      return;
    }
    
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

// Mock WebSocket implementation for development
class MockWebSocket {
  private messageCallback: ((message: WebSocketMessage) => void) | null = null;
  private disconnectCallback: (() => void) | null = null;
  private connected = true;
  
  constructor(private conversationId: string) {}
  
  send(message: WebSocketMessage): void {
    if (!this.connected) return;
    
    if (message.type === 'user_message' && message.content) {
      // Simulate typing indicator
      setTimeout(() => {
        if (this.messageCallback) {
          this.messageCallback({
            type: 'typing_indicator',
            is_typing: true
          });
        }
      }, 100);
      
      // Simulate AI response after delay
      setTimeout(() => {
        if (this.messageCallback) {
          // Stop typing
          this.messageCallback({
            type: 'typing_indicator',
            is_typing: false
          });
          
          // Send AI response
          const responses = [
            // Emma (art student)
            "That's really interesting! Tell me more. 😊",
            "I love hearing your thoughts on this!",
            "You seem really passionate about that. What got you into it?",
            "That reminds me of this painting I'm working on! Art is everywhere, isn't it?",
            
            // Sophia (intellectual)
            "That's such a unique perspective! I hadn't thought of it that way.",
            "Hmm, that raises some fascinating philosophical questions...",
            "Your mind works in intriguing ways. I appreciate depth in conversation.",
            
            // Isabella (businesswoman)
            "You're quite perceptive. I respect that in a person.",
            "Interesting approach. I deal with strategic thinking daily in my work.",
            "You have potential. Not everyone catches my attention so quickly.",
            
            // Luna (yoga instructor)
            "That's beautiful. I can feel the positive energy in your words. 🧘‍♀️",
            "Mindfulness teaches us to appreciate moments like these. Thank you for sharing.",
            "Your spirit seems so peaceful. Have you ever tried meditation?",
            
            // Zara (DJ)
            "Yo, that's actually fire! 🔥 You've got good vibes.",
            "That hits different! I love people who think outside the box.",
            "Dude, you're speaking my language! Music and life, it's all about rhythm.",
            
            // Victoria (model)
            "Darling, you have exquisite taste. I don't say that lightly.",
            "How refreshing to meet someone with actual substance.",
            "You intrigue me. That's... quite rare, actually.",
            
            // Mia (gamer)
            "OMG that's so cool! (◕‿◕) You're like, totally awesome!",
            "That's giving main character energy! ✨ I love it!",
            "Kawaii! You remind me of my favorite anime character! (´∀｀)",
            
            // Scarlett (gothic writer)
            "How beautifully melancholic... your words stir something in my dark heart.",
            "There's poetry in your soul. I can sense the shadows and light within you.",
            "You speak with the eloquence of someone who understands life's deeper mysteries..."
          ];
          
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          const charmPoints = Math.floor(Math.random() * 3) + 1;
          
          this.messageCallback({
            type: 'persona_response',
            content: randomResponse,
            charm_points_gained: charmPoints,
            level_unlocked: false,
            unlock_level: 0,
            typing_complete: true
          });
        }
      }, 1500 + Math.random() * 1000); // Variable delay for realism
    }
  }
  
  onMessage(callback: (message: WebSocketMessage) => void): void {
    this.messageCallback = callback;
  }
  
  onDisconnect(callback: () => void): void {
    this.disconnectCallback = callback;
  }
  
  disconnect(): void {
    this.connected = false;
    if (this.disconnectCallback) {
      this.disconnectCallback();
    }
  }
}

// Singleton instance
export const websocketService = new WebSocketService();
