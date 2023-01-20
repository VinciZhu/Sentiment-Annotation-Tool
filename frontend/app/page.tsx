import styles from './page.module.css'
import { Button } from 'antd'

const baseurl = process.env.FASTAPI_URL

export default async function Main() {
  const res = await fetch(baseurl + '/')
  const data = await res.json()
  return (
    <main className={styles.main}>
      {/* @ts-expect-error Server Component */}
      <MainTop />
      {/* @ts-expect-error Server Component */}
      <MainCenter />
      {/* @ts-expect-error Server Component */}
      <MainBottom />
    </main>
  )
}

async function MainTop() {
  const res = await fetch(baseurl + '/')
  const data = await res.json()
  return (
    <div className={styles.top}>
      <p className={styles.filename}>{data.filename}</p>
      <div>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          By HasiNed
        </a>
      </div>
    </div>
  )
}

async function MainCenter() {
  const res = await fetch(baseurl + '/next_post')
  const data = await res.json()
  return <div className={styles.center}>{data.next_post_id}</div>
}

async function MainBottom() {
  const cards = [
    {
      title: 'Docs',
      description: 'Find in-depth information about Next.js features and API.',
      url: 'https://beta.nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app',
    },
    {
      title: 'Templates',
      description: 'Explore the Next.js 13 playground.',
      url: 'https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app',
    },
    {
      title: 'Deploy',
      description:
        'Instantly deploy your Next.js site to a shareable URL with Vercel.',
      url: 'https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app',
    },
  ]

  return (
    <div className={styles.bottom}>
      {cards.map((card) => (
        <a
          key={card.title}
          href={card.url}
          className={styles.button}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>{card.title}</h2>
          <p>{card.description}</p>
        </a>
      ))}
    </div>
  )
}
