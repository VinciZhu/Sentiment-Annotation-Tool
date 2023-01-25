import { getNextUnlabeledPostID } from '@/api/post'
import { redirect } from 'next/navigation'

export default async function PostRedirect() {
  const next_id = await getNextUnlabeledPostID()
  redirect(`/post/${next_id}`)
  return <></>
}
