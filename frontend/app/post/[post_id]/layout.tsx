import '@/styles/globals.css'
import styles from '@/styles/post.module.css'
import {
  getPrevPostID,
  getNextPostID,
  getPostIDList,
  getFilename,
} from '@/api/post'
import PostSelect from '@/client/PostSelect'
import Link from 'next/link'

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { post_id: string }
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <main className={styles.main}>
          {/* @ts-expect-error Server Component */}
          <Header post_id={params.post_id} />
          {children}
          {/* @ts-expect-error Server Component */}
          <Footer post_id={params.post_id} />
        </main>
      </body>
    </html>
  )
}

async function Header({ post_id }: { post_id: string }) {
  const post_id_list = await getPostIDList()
  const filename = await getFilename()
  return (
    <div className={styles.header}>
      <div>{filename}</div>
      <PostSelect postList={post_id_list} defaultPost={post_id} />
    </div>
  )
}

async function Footer({ post_id }: { post_id: string }) {
  const prev_id = await getPrevPostID(post_id)
  const next_id = await getNextPostID(post_id)
  return (
    <div className={styles.footer}>
      <Link className={styles.prev} href={`/post/${prev_id}`}>
        Prev
      </Link>
      <Link className={styles.prev} href={`/post/${next_id}`}>
        Next
      </Link>
    </div>
  )
}
