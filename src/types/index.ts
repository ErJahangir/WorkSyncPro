/**
 * WorkSync Pro - Global Type Definitions
 * Complete type safety across the entire application
 */

// ─── User & Auth ─────────────────────────────────────────

export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
  is_online?: boolean;
  last_seen?: string;
  bio?: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// ─── Task ────────────────────────────────────────────────

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline?: string;
  assigned_to?: string[];
  created_by: string;
  created_at: string;
  updated_at?: string;
  tags?: string[];
  team_id?: string;
  attachments?: TaskAttachment[];
  comments_count?: number;
  // Joined fields
  assignees?: User[];
  creator?: User;
  comments?: Comment[];
}

export interface TaskAttachment {
  id: string;
  task_id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  created_at: string;
  uploader?: User;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline?: string;
  assigned_to?: string[];
  tags?: string[];
  team_id?: string;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  id: string;
}

// ─── Comment ─────────────────────────────────────────────

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  message: string;
  created_at: string;
  updated_at?: string;
  mentions?: string[];
  user?: User;
}

export interface CreateCommentInput {
  task_id: string;
  message: string;
  mentions?: string[];
}

// ─── Team ────────────────────────────────────────────────

export interface Team {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  created_by: string;
  created_at: string;
  members?: TeamMember[];
  members_count?: number;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: UserRole;
  joined_at: string;
  user?: User;
}

export interface TeamInvite {
  id: string;
  team_id: string;
  email: string;
  role: UserRole;
  invited_by: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

// ─── Notification ────────────────────────────────────────

export type NotificationType =
  | 'task_assigned'
  | 'task_completed'
  | 'comment_added'
  | 'deadline_reminder'
  | 'team_invite'
  | 'mention';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

// ─── Analytics ───────────────────────────────────────────

export interface DashboardStats {
  total_tasks: number;
  pending_tasks: number;
  completed_tasks: number;
  in_progress_tasks: number;
  team_members: number;
  completion_rate: number;
}

export interface WeeklyProductivity {
  day: string;
  completed: number;
  created: number;
}

export interface TeamPerformance {
  user: User;
  tasks_completed: number;
  tasks_assigned: number;
  completion_rate: number;
}

// ─── Navigation Types ─────────────────────────────────────

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  EmailVerification: {email: string};
};

export type MainTabParamList = {
  Dashboard: undefined;
  Tasks: undefined;
  Team: undefined;
  Analytics: undefined;
  Profile: undefined;
};

export type TaskStackParamList = {
  TaskList: undefined;
  TaskDetail: {taskId: string};
  CreateTask: undefined;
  EditTask: {task: Task};
  TaskComments: {taskId: string};
};

export type TeamStackParamList = {
  TeamList: undefined;
  TeamDetail: {teamId: string};
  InviteMember: {teamId: string};
  MemberProfile: {userId: string};
};

// ─── API Response ─────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ─── Form Types ───────────────────────────────────────────

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline?: Date;
  tags?: string;
}

export interface ProfileFormData {
  name: string;
  bio?: string;
  phone?: string;
}

// ─── Redux State ──────────────────────────────────────────

export interface RootState {
  auth: AuthState;
  tasks: TasksState;
  team: TeamState;
  notifications: NotificationsState;
  ui: UIState;
}

export interface TasksState {
  tasks: Task[];
  selectedTask: Task | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  filter: TaskFilter;
  pagination: PaginationState;
}

export interface TaskFilter {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  assignedTo?: string;
  sortBy?: 'created_at' | 'deadline' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export interface TeamState {
  teams: Team[];
  selectedTeam: Team | null;
  members: TeamMember[];
  isLoading: boolean;
  error: string | null;
}

export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

export interface UIState {
  isNetworkAvailable: boolean;
  isDarkMode: boolean;
}

// ─── Utility Types ────────────────────────────────────────

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
