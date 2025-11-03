import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Profile from './Profile'

type Props = object

export default async function page() {
  const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) redirect('/auth')
  return (
    <>
      <Profile />
    </>
  )
}