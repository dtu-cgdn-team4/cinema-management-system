import { Client } from '@stomp/stompjs';

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8080/ws';

/**
 * Đăng ký một kênh STOMP của backend (WebSocket /ws), tự kết nối lại khi rớt mạng.
 * onReconnect chạy mỗi lần kết nối lại (không chạy lần đầu) để trang tải lại dữ liệu có thể đã lỡ.
 * Trả về hàm hủy đăng ký, dùng làm cleanup của useEffect.
 */
export function subscribe(destination, onMessage, { onReconnect } = {}) {
  let connectedBefore = false;
  const client = new Client({
    brokerURL: WS_URL,
    reconnectDelay: 3000,
    onConnect: () => {
      client.subscribe(destination, (frame) => onMessage(JSON.parse(frame.body)));
      if (connectedBefore) onReconnect?.();
      connectedBefore = true;
    },
  });
  client.activate();
  return () => client.deactivate();
}
