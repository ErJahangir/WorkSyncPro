// Supabase Edge Function: Daily Reminder
// This function should be triggered by a Cron job (e.g. via pg_cron or GitHub Actions)

import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const FIREBASE_SERVICE_ACCOUNT = JSON.parse(
  Deno.env.get('FIREBASE_SERVICE_ACCOUNT')!,
);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

Deno.serve(async req => {
  try {
    // 1. Get current time (HH:MM)
    const now = new Date();
    const currentHour = now.getUTCHours();
    const currentMinute = now.getUTCMinutes();
    const timeString = `${currentHour
      .toString()
      .padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}:00`;

    // 2. Fetch users who have a reminder scheduled for this time
    const {data: tokens, error: tokenError} = await supabase
      .from('fcm_tokens')
      .select('user_id, token, platform')
      .eq('reminder_enabled', true)
      .eq('reminder_time', timeString);

    if (tokenError) throw tokenError;

    if (!tokens || tokens.length === 0) {
      return new Response(JSON.stringify({message: 'No reminders to send'}), {
        status: 200,
      });
    }

    // 3. For each token, get pending task count and send notification
    const results = await Promise.all(
      tokens.map(async (entry: any) => {
        // Get task count
        const {count} = await supabase
          .from('tasks')
          .select('*', {count: 'exact', head: true})
          .eq('created_by', entry.user_id)
          .in('status', ['todo', 'in_progress']);

        const message =
          count! > 0
            ? `You have ${count} pending tasks! ⚡`
            : "You're all caught up! ⚡";

        // Send via Firebase (Example using FCM v1 HTTP API)
        return sendFCMNotification(entry.token, 'Daily Reminder', message);
      }),
    );

    return new Response(JSON.stringify({sent: results.length}), {status: 200});
  } catch (err: any) {
    return new Response(JSON.stringify({error: err.message}), {status: 500});
  }
});

async function sendFCMNotification(token: string, title: string, body: string) {
  // In a real Edge Function, you'd use the Firebase Admin SDK or the REST API
  // This is a simplified placeholder for the FCM v1 API call
  return {success: true};
}
