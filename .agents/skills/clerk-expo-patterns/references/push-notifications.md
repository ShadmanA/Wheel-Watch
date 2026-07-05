# Push Notifications with User Context

Store Expo push tokens against the Clerk user in `publicMetadata`, written through your own server (it's server-write-only). A user can have multiple devices, so persist a token list, not a single token.

## Register Push Token After Sign-In

```tsx
import { useAuth } from '@clerk/expo'
import * as Notifications from 'expo-notifications'
import { useEffect } from 'react'

export function PushTokenRegistrar() {
  const { isLoaded, isSignedIn, getToken } = useAuth()

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    async function register() {
      const { status } = await Notifications.requestPermissionsAsync()
      if (status !== 'granted') return

      const token = (await Notifications.getExpoPushTokenAsync()).data

      // Send to your server, which appends the token to publicMetadata via the Backend SDK
      await fetch('https://your-api.example.com/register-push-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await getToken()}`,
        },
        body: JSON.stringify({ token }),
      })
    }

    register()
  }, [isLoaded, isSignedIn, getToken])

  return null
}
```

Server endpoint (Next.js example) — reads the caller from the session, dedupes, and appends to the token list:

```tsx
// app/api/register-push-token/route.ts
import { auth, clerkClient } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const { token } = await req.json()
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const existingTokens = (user.publicMetadata?.expoPushTokens as string[]) ?? []
  const tokens = Array.from(new Set([...existingTokens, token]))

  await client.users.updateUser(userId, {
    publicMetadata: { ...user.publicMetadata, expoPushTokens: tokens },
  })

  return new Response('OK')
}
```

## Send Notification to User (Server)

```tsx
import { clerkClient } from '@clerk/nextjs/server'

async function sendNotification(userId: string, title: string, body: string) {
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const tokens = (user.publicMetadata?.expoPushTokens as string[] | undefined) ?? []

  if (tokens.length === 0) return

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tokens.map(to => ({ to, title, body }))),
  })
}
```

## CRITICAL

- Don't write push tokens with `user.update({ unsafeMetadata })` from the client — route through a server endpoint so the token lands in `publicMetadata` (server-write-only), which can't be tampered with by other client-side code
- Persist tokens as a list and dedupe on write — a user can be signed in on multiple devices, and overwriting a single field loses other devices' tokens
- Re-register the push token if `user.id` changes (org switch does not change user.id, but sign-out/sign-in as different user does)
