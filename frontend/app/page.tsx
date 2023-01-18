import styles from './page.module.css'

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

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Get started by editing&nbsp;
          <code className={styles.code}>app/page.tsx</code>
        </p>
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

      <div className={styles.center}>
        Hello world!
        <div className={styles.thirteen}>13</div>
      </div>

      <div className={styles.grid}>
        {cards.map((card) => (
          <a
            key={card.title}
            href={card.url}
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              {card.title} <span>▶️</span>
            </h2>
            <p>{card.description}</p>
          </a>
        ))}
      </div>
    </main>
  )
}
