import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {Notification, NotificationsState} from '@/types';
import {db} from '@/services';

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (userId: string, {rejectWithValue}) => {
    try {
      const {data, error} = await db.getNotifications(userId);
      if (error) return rejectWithValue(error.message);
      return data || [];
    } catch {
      return rejectWithValue('Failed to load notifications');
    }
  },
);

export const markAsRead = createAsyncThunk(
  'notifications/markRead',
  async (id: string, {rejectWithValue}) => {
    try {
      await db.markNotificationRead(id);
      return id;
    } catch {
      return rejectWithValue('Failed to mark as read');
    }
  },
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.is_read) {
        state.unreadCount += 1;
      }
    },
    markAllRead: state => {
      state.notifications = state.notifications.map(n => ({
        ...n,
        is_read: true,
      }));
      state.unreadCount = 0;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNotifications.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload as Notification[];
        state.unreadCount = (action.payload as Notification[]).filter(
          n => !n.is_read,
        ).length;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const n = state.notifications.find(n => n.id === action.payload);
        if (n && !n.is_read) {
          n.is_read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
  },
});

export const {addNotification, markAllRead} = notificationsSlice.actions;
export default notificationsSlice.reducer;

