-- WorkSync Pro: Team Collaboration Migration
-- This migration sets up teams, members, invitations, and collaborative task infrastructure.

-- 1. Teams Table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 2. Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- 3. Team Invites Table
CREATE TABLE IF NOT EXISTS team_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, email)
);

-- 4. Update Tasks Table (ensure team_id exists)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tasks' AND column_name='team_id') THEN
        ALTER TABLE tasks ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 5. Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'invite', 'task_assigned', 'comment'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RLS Policies

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies if any
DROP POLICY IF EXISTS "Team members can view teams" ON teams;
DROP POLICY IF EXISTS "Admins can update teams" ON teams;
DROP POLICY IF EXISTS "Members can view other team members" ON team_members;
DROP POLICY IF EXISTS "Admins can manage invites" ON team_invites;
DROP POLICY IF EXISTS "Users can view their own invites" ON team_invites;
DROP POLICY IF EXISTS "Team members can view tasks" ON tasks;
DROP POLICY IF EXISTS "Team members can manage tasks" ON tasks;
DROP POLICY IF EXISTS "Team members can view comments" ON comments;
DROP POLICY IF EXISTS "Users can manage their own comments" ON comments;
DROP POLICY IF EXISTS "Users can manage their own notifications" ON notifications;

-- Teams: Members can view, Admins can edit
CREATE POLICY "Team members can view teams" ON teams
  FOR SELECT USING (EXISTS (SELECT 1 FROM team_members WHERE team_id = teams.id AND user_id = auth.uid()));

CREATE POLICY "Admins can update teams" ON teams
  FOR UPDATE USING (EXISTS (SELECT 1 FROM team_members WHERE team_id = teams.id AND user_id = auth.uid() AND role = 'admin'));

-- Team Members: Members can view each other
CREATE POLICY "Members can view other team members" ON team_members
  FOR SELECT USING (EXISTS (SELECT 1 FROM team_members AS current_member WHERE current_member.team_id = team_members.team_id AND current_member.user_id = auth.uid()));

-- Team Invites: Admins can manage, Invited users can view their own
CREATE POLICY "Admins can manage invites" ON team_invites
  FOR ALL USING (EXISTS (SELECT 1 FROM team_members WHERE team_id = team_invites.team_id AND user_id = auth.uid() AND role IN ('admin', 'manager')));

CREATE POLICY "Users can view their own invites" ON team_invites
  FOR SELECT USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Tasks: Team members can view and manage tasks
CREATE POLICY "Team members can view tasks" ON tasks
  FOR SELECT USING (
    (team_id IS NULL AND created_by = auth.uid()) OR
    EXISTS (SELECT 1 FROM team_members WHERE team_id = tasks.team_id AND user_id = auth.uid())
  );

CREATE POLICY "Team members can manage tasks" ON tasks
  FOR ALL USING (
    (team_id IS NULL AND created_by = auth.uid()) OR
    EXISTS (SELECT 1 FROM team_members WHERE team_id = tasks.team_id AND user_id = auth.uid())
  );

-- Comments: Team members can view and create comments
CREATE POLICY "Team members can view comments" ON comments
  FOR SELECT USING (EXISTS (SELECT 1 FROM tasks WHERE tasks.id = comments.task_id));

CREATE POLICY "Users can manage their own comments" ON comments
  FOR ALL USING (user_id = auth.uid());

-- Notifications: Users can view and manage their own
CREATE POLICY "Users can manage their own notifications" ON notifications
  FOR ALL USING (user_id = auth.uid());

-- 8. Functions and Triggers

-- Handle Invite Acceptance Trigger
CREATE OR REPLACE FUNCTION handle_invite_acceptance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    -- 1. Add user to team_members
    INSERT INTO team_members (team_id, user_id, role)
    SELECT NEW.team_id, auth.users.id, NEW.role
    FROM auth.users
    WHERE auth.users.email = NEW.email
    ON CONFLICT (team_id, user_id) DO NOTHING;
    
    -- 2. Create notification for the inviter
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      NEW.invited_by,
      'invite_accepted',
      'Invitation Accepted',
      NEW.email || ' has joined the team.',
      jsonb_build_object('team_id', NEW.team_id)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_invite_status_change ON team_invites;
CREATE TRIGGER on_invite_status_change
AFTER UPDATE ON team_invites
FOR EACH ROW EXECUTE FUNCTION handle_invite_acceptance();

-- Create notification when new invite is sent
CREATE OR REPLACE FUNCTION notify_on_new_invite()
RETURNS TRIGGER AS $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Find the user if they already exist
    SELECT id INTO target_user_id FROM auth.users WHERE email = NEW.email;
    
    IF target_user_id IS NOT NULL THEN
        INSERT INTO notifications (user_id, type, title, message, data)
        VALUES (
            target_user_id,
            'invite',
            'New Team Invitation',
            'You have been invited to join a team.',
            jsonb_build_object('team_id', NEW.team_id, 'invite_id', NEW.id)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_new_invite_sent ON team_invites;
CREATE TRIGGER on_new_invite_sent
AFTER INSERT ON team_invites
FOR EACH ROW EXECUTE FUNCTION notify_on_new_invite();
