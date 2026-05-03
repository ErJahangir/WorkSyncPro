import {useAppDispatch} from './useAppSelector';
import {useEffect} from 'react';
import {supabase} from '@/services/supabase';
import {showToast} from '@/utils';

export const useRealtimeNotifications = (userId?: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!userId) return;

    const channelName = `notif_${userId}_${Math.random()
      .toString(36)
      .slice(2, 7)}`;
    const channel = supabase.channel(channelName);

    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        payload => {
          const newNotif = payload.new as any;
          showToast('info', newNotif.title, newNotif.body);
        },
      )
      .subscribe(status => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to notifications');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, dispatch]);
};
