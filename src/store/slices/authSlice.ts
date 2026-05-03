/**
 * WorkSync Pro - Auth Slice
 * Manages authentication state with Supabase
 */

import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {AuthState, User} from '@/types/index';
import {supabaseAuth, db} from '@services/supabase';
import {showToast} from '@utils/toast';
import {STORAGE_KEYS} from '@constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isInitialized: false,
  hasSeenOnboarding: false,
  isLoading: false,
  error: null,
};

// ─── Async Thunks ─────────────────────────────────────────

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, {rejectWithValue}) => {
    try {
      console.log('initializeAuth');
      const {session, error} = await supabaseAuth.getSession();
      if (error || !session) return {session: null, user: null};

      const {data: user, error: userError} = await db.getUser(session.user.id);

      // FALLBACK: If authentication is successful but profile is missing from DB
      if (!user || userError) {
        console.log(
          'Profile missing, creating fallback profile for:',
          session.user.id,
        );
        const {data: newUser, error: upsertError} = await db.upsertUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || 'New User',
          email: session.user.email,
        });

        if (upsertError) {
          console.error('Upsert failed:', upsertError);
          return {session, user: null};
        }

        console.log('Fallback profile created successfully:', newUser);
        return {session, user: newUser};
      }

      const seenOnboarding = await AsyncStorage.getItem(
        STORAGE_KEYS.ONBOARDING_DONE,
      );

      return {
        session,
        user,
        hasSeenOnboarding: seenOnboarding === 'true',
      };
    } catch (err) {
      return rejectWithValue('Failed to initialize auth');
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    {email, password}: {email: string; password: string},
    {rejectWithValue},
  ) => {
    try {
      console.log('loginUser');
      const {data, error} = await supabaseAuth.signIn(email, password);
      if (error) return rejectWithValue(error.message);

      const {data: user} = await db.getUser(data.user!.id);
      return {session: data.session, user};
    } catch {
      return rejectWithValue('Login failed. Please try again.');
    }
  },
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (idToken: string, {rejectWithValue}) => {
    try {
      console.log('loginWithGoogle');
      const {data, error} = await supabaseAuth.signInWithGoogle(idToken);
      console.log(data, error, '====');

      if (error) return rejectWithValue(error.message);

      const {data: user} = await db.getUser(data.user!.id);
      return {session: data.session, user};
    } catch {
      return rejectWithValue('Google login failed. Please try again.');
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    {email, password, name}: {email: string; password: string; name: string},
    {rejectWithValue},
  ) => {
    try {
      console.log('registerUser');
      const {data, error} = await supabaseAuth.signUp(email, password, name);

      if (error) return rejectWithValue(error.message);
      return {session: data.session, user: data.user};
    } catch {
      return rejectWithValue('Registration failed. Please try again.');
    }
  },
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, {rejectWithValue}) => {
    console.log('logoutUser');
    try {
      const {error} = await supabaseAuth.signOut();
      if (error) return rejectWithValue(error.message);
    } catch {
      return rejectWithValue('Logout failed.');
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (
    {userId, updates}: {userId: string; updates: Partial<User>},
    {rejectWithValue},
  ) => {
    console.log('updateUserProfile');

    try {
      const {data, error} = await db.updateUser(userId, updates);
      console.log('updateUserProfile', data, error);
      if (error) return rejectWithValue(error.message);
      return data;
    } catch {
      return rejectWithValue('Failed to update profile.');
    }
  },
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, {rejectWithValue}) => {
    console.log('forgot');

    try {
      const {error} = await supabaseAuth.resetPassword(email);
      if (error) return rejectWithValue(error.message);
      return email;
    } catch {
      return rejectWithValue('Failed to send reset email.');
    }
  },
);

// ─── Slice ────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
    setInitialized: state => {
      state.isInitialized = true;
    },
    setOnboardingDone: state => {
      state.hasSeenOnboarding = true;
    },
  },
  extraReducers: builder => {
    // Initialize
    builder
      .addCase(initializeAuth.pending, state => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.hasSeenOnboarding = Boolean(action.payload.hasSeenOnboarding);
        if (action.payload.session && action.payload.user) {
          state.isAuthenticated = true;
          state.session = action.payload.session as AuthState['session'];
          state.user = action.payload.user as User;
        }
      })
      .addCase(initializeAuth.rejected, state => {
        state.isLoading = false;
        state.isInitialized = true;
        state.hasSeenOnboarding = false;
      });

    // Login
    builder
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.session = action.payload.session as AuthState['session'];
        state.user = action.payload.user as User;
        showToast('success', 'Welcome back! 👋');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Google Login
    builder
      .addCase(loginWithGoogle.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.session = action.payload.session as AuthState['session'];
        state.user = action.payload.user as User;
        showToast('success', 'Welcome back! 👋');
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, state => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      state.error = null;
    });

    // Update profile
    builder
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload as User;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {setUser, clearError, setInitialized, setOnboardingDone} =
  authSlice.actions;
export default authSlice.reducer;
