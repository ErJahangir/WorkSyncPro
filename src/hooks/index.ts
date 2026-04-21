/**
 * WorkSync Pro - Custom Hooks Collection
 */

import {useState, useEffect, useRef, useCallback} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {useAppDispatch} from './useAppSelector';
import {setNetworkAvailable} from '@store/slices/uiSlice';
import {realtime} from '@services/supabase';
import {
  addTaskRealtime,
  updateTaskRealtime,
  removeTaskRealtime,
} from '@store/slices/tasksSlice';

// ─── useNetworkStatus ─────────────────────────────────────

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected ?? true;
      setIsConnected(connected);
      dispatch(setNetworkAvailable(connected));
    });
    return () => unsubscribe();
  }, [dispatch]);

  return isConnected;
};

// ─── useDebounce ──────────────────────────────────────────

export const useDebounce = <T>(value: T, delay = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// ─── useRealtimeTasks ─────────────────────────────────────

export const useRealtimeTasks = (teamId?: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!teamId) return;

    const channel = realtime.subscribeToTasks(teamId, {
      onInsert: payload => {
        if ((payload as any).new) {
          dispatch(addTaskRealtime((payload as any).new));
        }
      },
      onUpdate: payload => {
        if ((payload as any).new) {
          dispatch(updateTaskRealtime((payload as any).new));
        }
      },
      onDelete: payload => {
        if ((payload as any).old?.id) {
          dispatch(removeTaskRealtime((payload as any).old.id));
        }
      },
    });

    return () => realtime.unsubscribe(channel);
  }, [teamId, dispatch]);
};

// ─── useRealtimeComments ──────────────────────────────────

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

// ─── useInterval ──────────────────────────────────────────

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);
  savedCallback.current = callback;

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
};

// ─── usePrevious ──────────────────────────────────────────

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

// ─── useMount ─────────────────────────────────────────────

export const useMount = (fn: () => void) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fn, []);
};

// ─── useToggle ────────────────────────────────────────────

export const useToggle = (
  defaultValue = false,
): [boolean, () => void, (v: boolean) => void] => {
  const [value, setValue] = useState(defaultValue);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle, setValue];
};
