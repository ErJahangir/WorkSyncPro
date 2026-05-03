import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {TeamState, Team, TeamMember} from '@/types/index';
import {db} from '@/services';
import {showToast} from '@/utils';

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
      const {data, error} = await db.sendInvite(teamId, email, role, invitedBy);

      if (error) return rejectWithValue(error.message);
      showToast('success', `Invitation sent to ${email}`);
      return data;
    } catch {
      return rejectWithValue('Failed to send invitation');
    }
  },
);

export const createTeam = createAsyncThunk(
  'team/createTeam',
  async (
    {
      name,
      description,
      userId,
    }: {name: string; description: string; userId: string},
    {dispatch, rejectWithValue},
  ) => {
    try {
      const {data, error} = await db.createTeam(name, description, userId);
      if (error) return rejectWithValue(error.message);

      // Automatically fetch updated teams
      dispatch(fetchTeams(userId));
      showToast('success', `Team "${name}" created successfully!`);
      return data;
    } catch {
      return rejectWithValue('Failed to create team');
    }
  },
);

export const acceptInvite = createAsyncThunk(
  'team/acceptInvite',
  async (
    {inviteId, userId}: {inviteId: string; userId: string},
    {dispatch, rejectWithValue},
  ) => {
    try {
      const {error} = await db.respondToInvite(inviteId, 'accepted');
      if (error) return rejectWithValue(error.message);

      // Refresh teams list
      dispatch(fetchTeams(userId));
      showToast('success', 'You have joined the team!');
      return inviteId;
    } catch {
      return rejectWithValue('Failed to accept invitation');
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
