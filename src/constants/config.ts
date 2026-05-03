/**
 * WorkSync Pro - App Constants & Configuration
 */

// ─── Supabase ─────────────────────────────────────────────
// In production, load these from react-native-config or similar
export const SUPABASE_URL = 'https://xbzkbwcpagbnsfeznmxx.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_xk0Js68jAuWj0mI0yEBlfA_DY-6SHc-';

// ─── App ──────────────────────────────────────────────────
export const APP_NAME = 'WorkSync Pro';
export const APP_VERSION = '1.0.0';
export const APP_BUNDLE_ID = 'com.worksyncpro.app';
export const GOOGLE_WEB_CLIENT_ID =
  '802352731530-d6v2qo4jhk5nne9dv32r1lg2ak33feta.apps.googleusercontent.com';
export const GOOGLE_IOS_CLIENT_ID =
  '802352731530-33kch9qgcjee8r08a6ifo9fhu5g1c707.apps.googleusercontent.com';
export const GOOGLE_ANDROID_CLIENT_ID =
  '802352731530-tcaudpakn0747u8lun61vsiilncjuudh.apps.googleusercontent.com';

// ─── Storage Keys ─────────────────────────────────────────
export const STORAGE_KEYS = {
  AUTH_SESSION: '@worksync:auth_session',
  USER_PROFILE: '@worksync:user_profile',
  THEME_MODE: '@worksync:theme_mode',
  ONBOARDING_DONE: '@worksync:onboarding_done',
  CACHED_TASKS: '@worksync:cached_tasks',
  CACHED_TEAM: '@worksync:cached_team',
  PUSH_TOKEN: '@worksync:push_token',
} as const;

// ─── Pagination ───────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 20;
export const COMMENTS_PAGE_SIZE = 30;

// ─── Task Constants ───────────────────────────────────────
export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const;
export const TASK_STATUSES = ['todo', 'in_progress', 'completed'] as const;

export const PRIORITY_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const STATUS_LABELS: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  manager: 'Manager',
  user: 'Member',
};

// ─── File Upload ──────────────────────────────────────────
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

// ─── Onboarding Slides ────────────────────────────────────
export const ONBOARDING_SLIDES = [
  {
    id: '1',
    title: 'Manage Tasks\nEfficiently',
    subtitle:
      'Create, assign, and track tasks in real-time with your entire team.',
    icon: '✅',
  },
  {
    id: '2',
    title: 'Collaborate\nSeamlessly',
    subtitle:
      'Chat with teammates, leave comments, and stay in sync everywhere.',
    icon: '💬',
  },
  {
    id: '3',
    title: 'Track Your\nProductivity',
    subtitle:
      'Get insights on team performance with beautiful analytics dashboards.',
    icon: '📊',
  },
];

// ─── Regex ────────────────────────────────────────────────
export const MENTION_REGEX = /@(\w+)/g;

// ─── Animation Durations ──────────────────────────────────
export const ANIMATION = {
  fast: 150,
  normal: 250,
  slow: 400,
};
