import styles from '@/styles/home.module.css'
import Link from 'next/link'
export default Home

async function Home() {
  return (
    <main className={styles.main}>
      <Link className={styles.button} href={`/post`}>
        click to start
      </Link>
    </main>
  )
}
