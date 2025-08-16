import {useCallback, useEffect, useState} from 'react';

interface Options {
  endpoint: string | (() => Promise<string>);
  enabled?: boolean;
  debugName: string;
  maxRetries?: number;
  reconnect?: boolean;
  pingTime?: number;
  pingPayload?: ArrayBufferLike | string;
  init?: (ws: WebSocket) => void;
}

const MAX_RETRY = 10;

export function useSocket(ops: Options) {
  const [endpoint, setEndpoint] = useState<string>('');
  const [retry, setRetry] = useState<number>(0);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const ping = useCallback(
    (send?: boolean) => {
      const ws = socket;
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        return;
      }

      if (!ops.pingPayload) {
        throw new Error('pingPayload is missing');
      }

      if (send) {
        ws.send(ops.pingPayload);
      }

      setTimeout(() => ping(true), ops.pingTime); // ping-pong every `ops.pingTime` seconds
    },
    [ops.pingPayload, ops.pingTime, socket],
  );

  // setup endpoint for socket
  useEffect(() => {
    const setupEndpoint = async () => {
      let _endpoint = ops.endpoint;
      if (typeof _endpoint === 'function') {
        _endpoint = await _endpoint();
      }

      setEndpoint(_endpoint);
    };

    setupEndpoint();
  }, [ops.endpoint]);

  // initiate a socket connection
  useEffect(() => {
    let ws: WebSocket;
    const _endpoint = endpoint;
    if (ops.enabled && _endpoint) {
      ws = new WebSocket(_endpoint);

      setSocket(ws);
    }

    return () => {
      if (ws) {
        if (
          ws.readyState === WebSocket.OPEN ||
          ws.readyState === WebSocket.CONNECTING
        ) {
          ws.close();
        }
      }
    };
  }, [ops.enabled, endpoint]);

  // reconnection logic
  useEffect(() => {
    const ws = socket;
    const _endpoint = endpoint;

    if (ws && _endpoint) {
      ws.onclose = () => {
        console.log('\n=== CONNECTION CLOSED ===', ops.debugName);

        if (ops.enabled && ops.reconnect !== false) {
          if (retry < (ops.maxRetries || MAX_RETRY)) {
            console.log(`=== RECONNECTING ${retry + 1} ===`, ops.debugName);

            setSocket(new WebSocket(_endpoint));
            setRetry(retry + 1);
          } else {
            console.log(
              `=== RECONNECTION TIMEOUT, TRIED ${retry} TIMES ===`,
              ops.debugName,
            );
          }
        }
      };

      ws.onopen = () => {
        ops.init?.(ws);
        setRetry(0);
        if (ops.pingTime) {
          ping();
        }
      };
    }
  }, [
    ops.enabled,
    ops.reconnect,
    ops.maxRetries,
    ops.pingTime,
    ops.pingPayload,
    ops.init,
    retry,
    endpoint,
    socket,
    ops.debugName,
    ops,
    ping,
  ]);

  // return the socket instance
  return socket;
}

export function useOnMessage<T = unknown>(ops: {
  socket: WebSocket | null;
  onMessage: (data: T) => void;
}) {
  useEffect(() => {
    const ws = ops.socket;
    const messageListener = (event: WebSocketMessageEvent) => {
      try {
        const data = JSON.parse(event.data) as T;
        ops.onMessage(data);
      } catch {
        /* empty */
      }
    };

    ws?.addEventListener('message', messageListener);
    return () => {
      ws?.removeEventListener('message', messageListener);
    };
  }, [ops]);
}
