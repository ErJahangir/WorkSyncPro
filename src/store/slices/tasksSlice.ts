/**
 * WorkSync Pro - Tasks Slice
 * Complete task management state with filtering, pagination, realtime
 */

import {createSlice, createAsyncThunk, PayloadAction, createSelector} from '@reduxjs/toolkit';
import {
  Task,
  TasksState,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilter,
} from '@/types';
import {db} from '@services/supabase';
import {showToast} from '@utils/toast';
import {DEFAULT_PAGE_SIZE} from '@constants/config';

const initialState: TasksState = {
  tasks: [],
  selectedTask: null,
  isLoading: false,
  isRefreshing: false,
  error: null,
  filter: {
    sortBy: 'created_at',
    sortOrder: 'desc',
  },
  pagination: {
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    hasMore: true,
  },
};

// ─── Async Thunks ─────────────────────────────────────────

export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (
    {refresh = false}: {refresh?: boolean} = {},
    {getState, rejectWithValue},
  ) => {
    try {
      console.log('fetchTasks');
      const state = getState() as {tasks: TasksState};
      const {filter, pagination} = state.tasks;
      const page = refresh ? 0 : pagination.page;
      const from = page * pagination.pageSize;
      const to = from + pagination.pageSize - 1;

      let query = db.getTasks(filter);
      query = (query as any).range(from, to);

      if (filter.search) {
        query = (query as any).or(
          `title.ilike.%${filter.search}%,description.ilike.%${filter.search}%`,
        );
      }

      if (filter.sortBy) {
        query = (query as any).order(filter.sortBy, {
          ascending: filter.sortOrder === 'asc',
        });
      }

      const {data, error, count} = await (query as any).returns();
      if (error) return rejectWithValue(error.message);

      return {tasks: data || [], total: count || 0, refresh, page};
    } catch {
      return rejectWithValue('Failed to load tasks');
    }
  },
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchById',
  async (taskId: string, {rejectWithValue}) => {
    console.log('fetchTaskById');
    try {
      const {data, error} = await db.getTask(taskId);
      console.log('fetchTaskById', data, error);
      if (error) return rejectWithValue(error.message);
      return data;
    } catch {
      return rejectWithValue('Failed to load task');
    }
  },
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (
    {input, userId}: {input: CreateTaskInput; userId: string},
    {rejectWithValue},
  ) => {
    try {
      const {data, error} = await db.createTask({
        ...input,
        created_by: userId,
        created_at: new Date().toISOString(),
      });
      console.log('createTask', data, error);
      if (error) return rejectWithValue(error.message);
      showToast('success', 'Task created successfully');
      return data;
    } catch {
      return rejectWithValue('Failed to create task');
    }
  },
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async (input: UpdateTaskInput, {rejectWithValue}) => {
    console.log('updateTask');
    try {
      const {id, ...updates} = input;
      const {data, error} = await db.updateTask(id, {
        ...updates,
        updated_at: new Date().toISOString(),
      });
      if (error) return rejectWithValue(error.message);
      showToast('success', 'Task updated');
      return data;
    } catch {
      return rejectWithValue('Failed to update task');
    }
  },
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (taskId: string, {rejectWithValue}) => {
    console.log('deleteTask');
    try {
      const {error} = await db.deleteTask(taskId);
      if (error) return rejectWithValue(error.message);
      showToast('success', 'Task deleted');
      return taskId;
    } catch {
      return rejectWithValue('Failed to delete task');
    }
  },
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  async (
    {taskId, status}: {taskId: string; status: Task['status']},
    {rejectWithValue},
  ) => {
    console.log('updateTaskStatus');
    try {
      const {data, error} = await db.updateTask(taskId, {
        status,
        updated_at: new Date().toISOString(),
      });
      if (error) return rejectWithValue(error.message);
      return data;
    } catch {
      return rejectWithValue('Failed to update status');
    }
  },
);

// ─── Slice ────────────────────────────────────────────────

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<TaskFilter>) => {
      state.filter = {...state.filter, ...action.payload};
      state.pagination.page = 0;
      state.pagination.hasMore = true;
    },
    clearFilter: state => {
      state.filter = {sortBy: 'created_at', sortOrder: 'desc'};
      state.pagination.page = 0;
    },
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },
    // Realtime updates
    addTaskRealtime: (state, action: PayloadAction<Task>) => {
      const exists = state.tasks.find(t => t.id === action.payload.id);
      if (!exists) {
        state.tasks.unshift(action.payload);
      }
    },
    updateTaskRealtime: (state, action: PayloadAction<Task>) => {
      const idx = state.tasks.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) {
        state.tasks[idx] = action.payload;
      }
      if (state.selectedTask?.id === action.payload.id) {
        state.selectedTask = action.payload;
      }
    },
    removeTaskRealtime: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // 1. Specific Cases (addCase)
    builder
      .addCase(fetchTasks.pending, (state, action) => {
        if (action.meta.arg?.refresh) {
          state.isRefreshing = true;
        } else {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isRefreshing = false;
        const {tasks, total, refresh, page} = action.payload;

        if (refresh || page === 0) {
          state.tasks = tasks as Task[];
        } else {
          state.tasks.push(...(tasks as Task[]));
        }

        state.pagination.total = total;
        state.pagination.page = page + 1;
        state.pagination.hasMore = tasks.length === state.pagination.pageSize;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isRefreshing = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedTask = action.payload as Task;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.tasks.unshift(action.payload as Task);
        }
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const idx = state.tasks.findIndex(
            t => t.id === (action.payload as Task).id,
          );
          if (idx !== -1) state.tasks[idx] = action.payload as Task;
          if (state.selectedTask?.id === (action.payload as Task).id) {
            state.selectedTask = action.payload as Task;
          }
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
        if (state.selectedTask?.id === action.payload) {
          state.selectedTask = null;
        }
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const idx = state.tasks.findIndex(
            t => t.id === (action.payload as Task).id,
          );
          if (idx !== -1) state.tasks[idx] = action.payload as Task;
        }
      });

    // 2. Matchers (addMatcher) - MUST COME AFTER ALL addCase
    builder
      .addMatcher(
        action =>
          [
            fetchTaskById.pending.type,
            createTask.pending.type,
            updateTask.pending.type,
            deleteTask.pending.type,
            updateTaskStatus.pending.type,
          ].includes(action.type),
        state => {
          state.isLoading = true;
          state.error = null;
        },
      )
      .addMatcher(
        action =>
          [
            fetchTaskById.rejected.type,
            createTask.rejected.type,
            updateTask.rejected.type,
            deleteTask.rejected.type,
            updateTaskStatus.rejected.type,
          ].includes(action.type),
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.payload as string;
        },
      );
  },
});

export const {
  setFilter,
  clearFilter,
  setSelectedTask,
  addTaskRealtime,
  updateTaskRealtime,
  removeTaskRealtime,
  clearError,
} = tasksSlice.actions;

export default tasksSlice.reducer;

// ─── Selectors ────────────────────────────────────────────

export const selectAllTasks = (state: {tasks: TasksState}) => state.tasks.tasks;
export const selectSelectedTask = (state: {tasks: TasksState}) =>
  state.tasks.selectedTask;
export const selectTasksLoading = (state: {tasks: TasksState}) =>
  state.tasks.isLoading;
export const selectTasksRefreshing = (state: {tasks: TasksState}) =>
  state.tasks.isRefreshing;
export const selectTaskFilter = (state: {tasks: TasksState}) =>
  state.tasks.filter;
export const selectTasksPagination = (state: {tasks: TasksState}) =>
  state.tasks.pagination;

export const selectTaskStats = createSelector(
  [selectAllTasks],
  tasks => ({
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    todo: tasks.filter(t => t.status === 'todo').length,
  }),
);
