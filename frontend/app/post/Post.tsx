'use client'
import styles from '@/styles/post.module.css'
import { updatePostNegative, updatePostPositive } from '@/api/post'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  PlusIcon,
  MinusIcon,
  ArrowDownTrayIcon,
  CloudArrowUpIcon,
  PresentationChartBarIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default async function Post({
  children,
  data,
}: {
  children: React.ReactNode
  data: {
    default_post_id: string
    post_id_list: string[]
    filename: string
  }
}) {
  const { default_post_id, post_id_list, filename } = data
  const [postID, setPostID] = useState(default_post_id)
  return (
    <main className={styles.main}>
      {children}
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.toolbar}>
          <ArrowDownTrayIcon />
          <CloudArrowUpIcon />
          <PresentationChartBarIcon />
          <div className={styles.label}>{filename}</div>
        </div>
        <div className={styles.select}>
          <Link className={styles.button} href={`/post/${postID}`}>
            {postID}&nbsp;
            <ChevronDownIcon className={styles.icon} />
          </Link>
          <div className={styles.menu}>
            {post_id_list.map((id) => (
              <Link key={id} className={styles.option} href={`/post/${id}`}>
                {id}
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* Footer */}
    </main>
  )
}

async function Footer({ postID }: { postID: string }) {
  const [prev_id, next_id, prev_unlabeled_id, next_unlabeled_id] =
    await Promise.all([
      getPrevPostID(postID),
      getNextPostID(postID),
      getPrevUnlabeledPostID(postID),
      getNextUnlabeledPostID(postID),
    ])
  return (
    <div className={styles.footer}>
      <Link
        className={prev_unlabeled_id ? '' : styles.disabled}
        href={`/post/${prev_unlabeled_id}`}
      >
        <ChevronDoubleLeftIcon />
      </Link>
      <Link
        className={prev_id ? '' : styles.disabled}
        href={`/post/${prev_id}`}
      >
        <ChevronLeftIcon />
      </Link>
      <Link
        className={next_id ? '' : styles.disabled}
        href={`/post/${next_id}`}
      >
        <ChevronRightIcon />
      </Link>
      <Link
        className={next_unlabeled_id ? '' : styles.disabled}
        href={`/post/${next_unlabeled_id}`}
      >
        <ChevronDoubleRightIcon />
      </Link>
    </div>
  )
}

async function Sider({ postID }: { postID: string }) {
  const sentiment = await getPostSentiment(postID)
  return (
    <div className={styles.sider}>
      <div className={styles.select}>
        <PlusIcon className={styles.button} />
        <SentimentMenu
          postID={postID}
          target="positive"
          defaultSentiment={sentiment.post_positive}
        />
      </div>
      <div className={styles.select}>
        <MinusIcon className={styles.button} />
        <SentimentMenu
          postID={postID}
          target="negative"
          defaultSentiment={sentiment.post_negative}
        />
      </div>
    </div>
  )
}
