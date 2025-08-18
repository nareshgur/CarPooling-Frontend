import { store } from "./store";
import { addNotification } from "./slices/notificationsSlice";

let socket;

export function initWebSocket(userId) {
  socket = new WebSocket(`ws://localhost:3000?userId=${userId}`);

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "notification") {
        store.dispatch(addNotification(data.payload));
      }
    } catch (err) {
      console.error("WebSocket parse error:", err);
    }
  };
}

export function closeWebSocket() {
  if (socket) socket.close();
}
