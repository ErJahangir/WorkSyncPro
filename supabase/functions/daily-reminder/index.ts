// Supabase Edge Function: Daily Reminder (FCM v1 Implementation)
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';

interface ServiceAccount {
  project_id: string;
  client_email: string;
  private_key: string;
}

interface FCMTokenEntry {
  user_id: string;
  token: string;
  platform: string;
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const FIREBASE_SERVICE_ACCOUNT: ServiceAccount = JSON.parse(
  Deno.env.get('FIREBASE_SERVICE_ACCOUNT')!,
);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

Deno.serve(async (req: Request) => {
  try {
    const now = new Date();
    const currentHour = now.getUTCHours();
    const currentMinute = now.getUTCMinutes();
    const timeString = `${currentHour
      .toString()
      .padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}:00`;

    console.log(`Checking reminders for ${timeString}`);

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

    const accessToken = await getGoogleAccessToken(FIREBASE_SERVICE_ACCOUNT);

    const results = await Promise.allSettled(
      tokens.map(async (entry: FCMTokenEntry) => {
        const {count} = await supabase
          .from('tasks')
          .select('*', {count: 'exact', head: true})
          .eq('created_by', entry.user_id)
          .in('status', ['todo', 'in_progress']);

        const messageBody =
          count! > 0
            ? `You have ${count} pending tasks! ⚡`
            : "You're all caught up! ⚡";

        return sendFCMv1(
          entry.token,
          'Daily Reminder',
          messageBody,
          accessToken,
          FIREBASE_SERVICE_ACCOUNT.project_id,
        );
      }),
    );

    return new Response(JSON.stringify({results}), {status: 200});
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error);
    return new Response(JSON.stringify({error: error.message}), {status: 500});
  }
});

async function getGoogleAccessToken(serviceAccount: ServiceAccount) {
  // Logic for fetching Google Access Token using the Service Account
  // This usually involves a JWT signed with RS256.
  // For this environment, ensure the token is fetched or the library is available.

  // Note: This is a structural placeholder for the token exchange.
  // Real implementation requires 'jose' or 'google-auth-library' equivalent.
  return 'TOKEN_PLACEHOLDER';
}

async function sendFCMv1(
  token: string,
  title: string,
  body: string,
  accessToken: string,
  projectId: string,
) {
  const fcmUrl = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;
  const response = await fetch(fcmUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: {
        token: token,
        notification: {title, body},
        data: {click_action: 'FLUTTER_NOTIFICATION_CLICK'},
      },
    }),
  });

  return response.json();
}
