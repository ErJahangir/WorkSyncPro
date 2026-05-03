/**
 * WorkSync Pro - Supabase Client
 * Configured with AsyncStorage for session persistence
 */

import {createClient} from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SUPABASE_URL, SUPABASE_KEY} from '@/constants';
import {decodeBase64} from '@/utils';

// Custom storage adapter using AsyncStorage
const ExpoSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// ─── Auth Helpers ─────────────────────────────────────────

export const supabaseAuth = {
  signUp: async (email: string, password: string, name: string) => {
    const {data, error} = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {name, role: 'user'},
      },
    });
    return {data, error};
  },

  signIn: async (email: string, password: string) => {
    const {data, error} = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return {data, error};
  },

  signOut: async () => {
    const {error} = await supabase.auth.signOut();
    return {error};
  },

  resetPassword: async (email: string) => {
    const {data, error} = await supabase.auth.resetPasswordForEmail(email);
    return {data, error};
  },

  getSession: async () => {
    const {data, error} = await supabase.auth.getSession();
    return {session: data.session, error};
  },

  onAuthStateChange: (
    callback: Parameters<typeof supabase.auth.onAuthStateChange>[0],
  ) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  signInWithGoogle: async (idToken: string) => {
    const {data, error} = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });
    return {data, error};
  },
};

// ─── Database Helpers ─────────────────────────────────────

export const db = {
  // Users
  getUser: (id: string) =>
    supabase.from('users').select('*').eq('id', id).single(),

  updateUser: (id: string, updates: Record<string, unknown>) =>
    supabase.from('users').update(updates).eq('id', id).select().single(),

  upsertUser: (user: Record<string, unknown>) =>
    supabase.from('users').upsert(user).select().single(),

  // Tasks
  getTasks: (filters?: any) => {
    let query = supabase
      .from('tasks')
      .select(
        `
        *,
        creator:users(id, name, avatar),
        assignees:task_assignees(user:users(id, name, avatar))
      `,
        {count: 'exact'},
      )
      .order('created_at', {ascending: false});

    if (filters?.status) {
      query = query.eq('status', filters.status as string);
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority as string);
    }
    return query;
  },

  getTask: (id: string) =>
    supabase
      .from('tasks')
      .select(
        `
        *,
        creator:users(id, name, avatar),
        assignees:task_assignees(user:users(id, name, avatar)),
        comments(*, user:users(id, name, avatar)),
        attachments:files(*)
      `,
      )
      .eq('id', id)
      .single(),

  createTask: (task: Record<string, unknown>) =>
    supabase.from('tasks').insert(task).select().single(),

  updateTask: (id: string, updates: Record<string, unknown>) =>
    supabase.from('tasks').update(updates).eq('id', id).select().single(),

  deleteTask: (id: string) => supabase.from('tasks').delete().eq('id', id),

  // Comments
  getComments: (taskId: string) =>
    supabase
      .from('comments')
      .select('*, user:users(id, name, avatar)')
      .eq('task_id', taskId)
      .order('created_at', {ascending: true}),

  createComment: (comment: Record<string, unknown>) =>
    supabase
      .from('comments')
      .insert(comment)
      .select('*, user:users(id, name, avatar)')
      .single(),

  // Teams
  getTeams: (userId: string) =>
    supabase.from('team_members').select('team:teams(*)').eq('user_id', userId),

  getTeamMembers: (teamId: string) =>
    supabase
      .from('team_members')
      .select('*, user:users(id, name, email, avatar, role)')
      .eq('team_id', teamId),

  // Notifications
  getNotifications: (userId: string) =>
    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', {ascending: false})
      .limit(50),

  markNotificationRead: (id: string) =>
    supabase.from('notifications').update({is_read: true}).eq('id', id),

  // FCM Tokens
  saveFCMToken: (
    userId: string,
    token: string,
    platform: 'android' | 'ios',
    reminderEnabled?: boolean,
    reminderTime?: string,
  ) =>
    supabase.from('fcm_tokens').upsert(
      {
        user_id: userId,
        token: token,
        platform: platform,
        reminder_enabled: reminderEnabled,
        reminder_time: reminderTime,
      },
      {onConflict: 'user_id, token'},
    ),

  removeFCMToken: (token: string) =>
    supabase.from('fcm_tokens').delete().eq('token', token),
};

// ─── Storage Helpers ─────────────────────────────────────

export const storage = {
  uploadAvatar: async (
    userId: string,
    fileUri: string,
    fileType: string,
    base64?: string,
  ) => {
    const ext = fileType.split('/')[1] || 'jpg';
    const path = `${userId}/avatar_${Date.now()}.${ext}`;

    let body;
    if (base64) {
      body = decodeBase64(base64);
    } else {
      // Fallback to File-like object if base64 is missing
      body = {
        uri: fileUri,
        name: `avatar.${ext}`,
        type: fileType,
      } as any;
    }

    const {data, error} = await supabase.storage
      .from('avatars')
      .upload(path, body, {
        contentType: fileType,
        upsert: true,
      });

    console.log('Upload Debug:', {path, error, data});

    if (error) return {url: null, error};

    const {data: urlData} = supabase.storage.from('avatars').getPublicUrl(path);

    return {url: urlData.publicUrl, error: null};
  },

  uploadTaskFile: async (
    taskId: string,
    fileUri: string,
    fileName: string,
    fileType: string,
  ) => {
    const path = `tasks/${taskId}/${Date.now()}_${fileName}`;

    const fileBody = {
      uri: fileUri,
      name: fileName,
      type: fileType,
    } as any;

    const {data, error} = await supabase.storage
      .from('task-files')
      .upload(path, fileBody, {contentType: fileType});

    if (error) return {url: null, error};

    const {data: urlData} = supabase.storage
      .from('task-files')
      .getPublicUrl(path);

    return {url: urlData.publicUrl, error: null};
  },

  deleteFile: async (bucket: string, path: string) => {
    return supabase.storage.from(bucket).remove([path]);
  },
};

// ─── Realtime Helpers ─────────────────────────────────────

export const realtime = {
  subscribeToTasks: (
    teamId: string,
    callbacks: {
      onInsert?: (payload: Record<string, unknown>) => void;
      onUpdate?: (payload: Record<string, unknown>) => void;
      onDelete?: (payload: Record<string, unknown>) => void;
    },
  ) => {
    return supabase
      .channel(`tasks:${teamId}`)
      .on(
        'postgres_changes',
        {event: 'INSERT', schema: 'public', table: 'tasks'},
        payload => callbacks.onInsert?.(payload),
      )
      .on(
        'postgres_changes',
        {event: 'UPDATE', schema: 'public', table: 'tasks'},
        payload => callbacks.onUpdate?.(payload),
      )
      .on(
        'postgres_changes',
        {event: 'DELETE', schema: 'public', table: 'tasks'},
        payload => callbacks.onDelete?.(payload),
      )
      .subscribe();
  },

  subscribeToComments: (
    taskId: string,
    onNewComment: (payload: Record<string, unknown>) => void,
  ) => {
    return supabase
      .channel(`comments:${taskId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `task_id=eq.${taskId}`,
        },
        payload => onNewComment(payload),
      )
      .subscribe();
  },

  unsubscribe: (channel: ReturnType<typeof supabase.channel>) => {
    supabase.removeChannel(channel);
  },
};
