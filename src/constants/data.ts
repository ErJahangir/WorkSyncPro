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
