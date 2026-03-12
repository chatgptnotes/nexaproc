import { useEffect, useRef } from 'react';
import { socketService } from '@/services/socket.service';
import { useAuthStore } from '@/stores/useAuthStore';

export function useSocket(): void {
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const connectedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated() && token && !connectedRef.current) {
      socketService.connect(token);
      connectedRef.current = true;
    }

    return () => {
      if (connectedRef.current) {
        socketService.disconnect();
        connectedRef.current = false;
      }
    };
  }, [token, isAuthenticated]);
}
