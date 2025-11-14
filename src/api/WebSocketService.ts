// src/api/WebSocketService.ts

export class WebSocketService {
  private ws: WebSocket | null = null;

  connect(url: string, onMessage: (data: any) => void) {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('✅ WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      console.log('📩 Received:', event.data);
      try {
        const message = JSON.parse(event.data);
        onMessage(message);
      } catch {
        onMessage(event.data);
      }
    };

    this.ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
    };

    this.ws.onerror = (error) => {
      console.error('⚠️ WebSocket error:', error);
    };
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('⚠️ WebSocket not connected');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsService = new WebSocketService();
