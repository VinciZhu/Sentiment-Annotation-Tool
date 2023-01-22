'use client'
import styles from '@/styles/post.module.css'
import { useRouter } from 'next/navigation'

export default function SelectPost({
  postList,
  defaultPost,
}: {
  postList: string[]
  defaultPost: string
}) {
  const router = useRouter()
  return (
    <select
      className={styles.select}
      defaultValue={defaultPost}
      onChange={(e) => router.push(`/post/${e.target.value}`)}
    >
      {postList.map((id) => (
        <option key={id} value={id}>
          {id}
        </option>
      ))}
    </select>
  )
}
