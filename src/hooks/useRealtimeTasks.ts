// ─── useRealtimeTasks ─────────────────────────────────────

import {useAppDispatch} from './useAppSelector';
import {useEffect} from 'react';
import {realtime} from '@/services';
import {
  addTaskRealtime,
  removeTaskRealtime,
  updateTaskRealtime,
} from '@/store/slices';

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
