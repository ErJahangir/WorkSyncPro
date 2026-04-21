/**
 * WorkSync Pro - Team Slice
 */

import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {TeamState, Team, TeamMember} from '@/types/index';
import {db} from '@services/supabase';
import {showToast} from '@utils/toast';

const initialState: TeamState = {
  teams: [],
  selectedTeam: null,
  members: [],
  isLoading: false,
  error: null,
};

export const fetchTeams = createAsyncThunk(
  'team/fetchTeams',
  async (userId: string, {rejectWithValue}) => {
    try {
      const {data, error} = await db.getTeams(userId);
      if (error) return rejectWithValue(error.message);
      return (data || []).map((d: {team: Team}) => d.team).filter(Boolean);
    } catch {
      return rejectWithValue('Failed to load teams');
    }
  },
);

export const fetchTeamMembers = createAsyncThunk(
  'team/fetchMembers',
  async (teamId: string, {rejectWithValue}) => {
    try {
      const {data, error} = await db.getTeamMembers(teamId);
      if (error) return rejectWithValue(error.message);
      return data || [];
    } catch {
      return rejectWithValue('Failed to load team members');
    }
  },
);

export const inviteMember = createAsyncThunk(
  'team/inviteMember',
  async (
    {
      teamId,
      email,
      role,
      invitedBy,
    }: {teamId: string; email: string; role: string; invitedBy: string},
    {rejectWithValue},
  ) => {
    try {
      const {data, error} = await (db as any).supabase
        ?.from('team_invites')
        .insert({
          team_id: teamId,
          email,
          role,
          invited_by: invitedBy,
          status: 'pending',
        })
        .select()
        .single();

      if (error) return rejectWithValue(error.message);
      showToast('success', `Invitation sent to ${email}`);
      return data;
    } catch {
      return rejectWithValue('Failed to send invitation');
    }
  },
);

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setSelectedTeam: (state, action: PayloadAction<Team | null>) => {
      state.selectedTeam = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTeams.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teams = action.payload as Team[];
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.members = action.payload as TeamMember[];
      });
  },
});

export const {setSelectedTeam, clearError: clearTeamError} = teamSlice.actions;
export default teamSlice.reducer;
