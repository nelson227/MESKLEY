"use client";

import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000";

const EVENT_QUERY_MAP: Record<string, string[]> = {
  "listings:changed": ["listings", "listing", "admin-stats"],
  "applications:changed": ["applications", "admin-stats"],
  "candidatures:changed": ["candidatures", "admin-stats"],
  "contacts:changed": ["admin-stats"],
};

export function useSocket() {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const { type } = JSON.parse(event.data as string);
        const keys = EVENT_QUERY_MAP[type];
        if (keys) {
          keys.forEach((key) =>
            queryClient.invalidateQueries({ queryKey: [key] })
          );
        }
      } catch {
        // Ignore malformed messages
      }
    };

    ws.onclose = () => {
      reconnectTimer.current = setTimeout(connect, 3000);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [queryClient]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);
}
