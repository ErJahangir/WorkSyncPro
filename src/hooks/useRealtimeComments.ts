// ─── useRealtimeComments ──────────────────────────────────

import {realtime} from '@/services';
import {useEffect, useRef} from 'react';

export const useRealtimeComments = (
  taskId: string,
  onNewComment: (comment: unknown) => void,
) => {
  const callbackRef = useRef(onNewComment);
  callbackRef.current = onNewComment;

  useEffect(() => {
    const channel = realtime.subscribeToComments(taskId, payload => {
      callbackRef.current((payload as any).new);
    });
    return () => realtime.unsubscribe(channel);
  }, [taskId]);
};
