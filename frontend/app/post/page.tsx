import styles from '@/styles/post.module.css'
import { getNextPostID } from '@/api/post'
import Link from 'next/link'
export default Main

async function Main() {
  const next_id = await getNextPostID()
  return (
    <div className={styles.start}>
      <Link className={styles.button} href={`/post/${next_id}`}>Start</Link>
    </div>
  )
}
