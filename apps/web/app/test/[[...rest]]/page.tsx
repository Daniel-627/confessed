
'use client'

import { useAuth, SignIn, SignInButton, SignOutButton } from '@clerk/nextjs'

import { useEffect, useState } from 'react'

export default function TestPage() {
  const { getToken, isSignedIn } = useAuth()
  const [token, setToken] = useState<string | null>(null)
  const [me, setMe] = useState<any>(null)

  useEffect(() => {
    async function fetchToken() {
      if (!isSignedIn) return
      const t = await getToken()
      setToken(t)

      if (t) {
        const res = await fetch('http://localhost:3001/me', {
          headers: { Authorization: `Bearer ${t}` },
        })
        const data = await res.json()
        setMe(data)
      }
    }
    fetchToken()
  }, [getToken, isSignedIn])

  if (!isSignedIn) {
    return (
      <div style={{ padding: '2rem' }}>
        <SignIn />
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h2>Token</h2>
      <pre style={{ fontSize: '11px', wordBreak: 'break-all' }}>{token}</pre>
      <h2>GET /me response</h2>
      <pre>{JSON.stringify(me, null, 2)}</pre>
    </div>
  )
}