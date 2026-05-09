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
const getServiceAccount = (): ServiceAccount => {
  const raw = Deno.env.get('FIREBASE_SERVICE_ACCOUNT');
  if (!raw) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set');
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    if (raw.startsWith('$(') || raw.startsWith('`')) {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT appears to contain a literal shell command instead of JSON. ' +
          'Ensure you set the secret using the actual file content, e.g., ' +
          'supabase secrets set FIREBASE_SERVICE_ACCOUNT="$(cat your-file.json)"',
      );
    }
    throw new Error(`Failed to parse FIREBASE_SERVICE_ACCOUNT: ${err.message}`);
  }
};

const FIREBASE_SERVICE_ACCOUNT = getServiceAccount();

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

Deno.serve(async (req: Request) => {
  try {
    const now = new Date();
    const currentHour = now.getUTCHours();
    const currentMinute = now.getUTCMinutes();
    const timeString = `${currentHour
      .toString()
      .padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}:00`;

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

function base64url(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function getGoogleAccessToken(serviceAccount: ServiceAccount) {
  try {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 3600;
    const header = {alg: 'RS256', typ: 'JWT'};
    const payload = {
      iss: serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/firebase.messaging',
      aud: 'https://oauth2.googleapis.com/token',
      exp,
      iat,
    };

    const encodedHeader = base64url(JSON.stringify(header));
    const encodedPayload = base64url(JSON.stringify(payload));
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    const pemHeader = '-----BEGIN PRIVATE KEY-----';
    const pemFooter = '-----END PRIVATE KEY-----';
    const privateKeyPem = serviceAccount.private_key
      .replace(pemHeader, '')
      .replace(pemFooter, '')
      .replace(/\s/g, '');

    const binaryKey = Uint8Array.from(atob(privateKeyPem), c =>
      c.charCodeAt(0),
    );
    const key = await crypto.subtle.importKey(
      'pkcs8',
      binaryKey,
      {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256'},
      false,
      ['sign'],
    );

    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      key,
      new TextEncoder().encode(signatureInput),
    );

    const encodedSignature = btoa(
      String.fromCharCode(...new Uint8Array(signature)),
    )
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const jwt = `${signatureInput}.${encodedSignature}`;

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    });

    const data = await res.json();
    if (data.error) {
      throw new Error(
        `Google Auth Error: ${data.error_description || data.error}`,
      );
    }
    return data.access_token;
  } catch (e) {
    console.error('JWT Generation Failed:', e);
    throw e;
  }
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
