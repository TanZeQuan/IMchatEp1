// src/api/WebSocketService.ts

// ============================================
// WebSocket 服务类
// ============================================

/**
 * WebSocket 连接服务
 * 管理 WebSocket 连接、消息发送和接收
 */
export class WebSocketService {
  private ws: WebSocket | null = null;

  /**
   * 连接 WebSocket
   * @param url WebSocket 服务器地址
   * @param onMessage 接收消息的回调函数
   */
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

  /**
   * 发送消息
   * @param data 要发送的数据
   */
  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('⚠️ WebSocket not connected');
    }
  }

  /**
   * 断开 WebSocket 连接
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// ============================================
// 导出单例实例
// ============================================
export const wsService = new WebSocketService();
