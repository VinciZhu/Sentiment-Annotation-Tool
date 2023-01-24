'use client'
import styles from '@/styles/post.module.css'
import {
  getPrevPostID,
  getNextPostID,
  getPostIDList,
  getFilename,
  getPrevUnlabeledPostID,
  getNextUnlabeledPostID,
  getPostSentiment,
  PostSentimentOptions,
  PostSentimentType,
  updatePostPositive,
  updatePostNegative,
} from '@/api/post'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  ArrowDownTrayIcon,
  CloudArrowUpIcon,
  PresentationChartBarIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { useState, useEffect } from 'react'
import { create } from 'zustand'

interface PostContext {
  postIDList: string[]
  filename: string
  fetch: () => void
}

const usePostContext = create<PostContext>((set) => ({
  postIDList: [],
  filename: '',
  fetch: async () => {
    const [postIDList, filename] = await Promise.all([
      getPostIDList(),
      getFilename(),
    ])
    set({ postIDList, filename })
  },
}))

interface PostState {
  postID: string
  prevID: string
  nextID: string
  prevUnlabeledID: string
  nextUnlabeledID: string
  postPositive: PostSentimentType
  postNegative: PostSentimentType
  setPostPositive: (postPositive: PostSentimentType) => void
  setPostNegative: (postNegative: PostSentimentType) => void
  fetch: (postID: PostSentimentType) => void
}

const usePostStore = create<PostState>((set) => ({
  postID: '',
  prevID: '',
  nextID: '',
  prevUnlabeledID: '',
  nextUnlabeledID: '',
  postPositive: '',
  postNegative: '',
  setPostPositive: async (postPositive: PostSentimentType) =>
    set((state) => {
      updatePostPositive(state.postID, postPositive)
      return { postPositive }
    }),
  setPostNegative: async (postNegative: PostSentimentType) =>
    set((state) => {
      updatePostNegative(state.postID, postNegative)
      return { postNegative }
    }),
  fetch: async (postID: PostSentimentType) => {
    set({ postID })
    const [prevID, nextID, prevUnlabeledID, nextUnlabeledID, postSentiment] =
      await Promise.all([
        getPrevPostID(postID),
        getNextPostID(postID),
        getPrevUnlabeledPostID(postID),
        getNextUnlabeledPostID(postID),
        getPostSentiment(postID),
      ])
    set({
      prevID,
      nextID,
      prevUnlabeledID,
      nextUnlabeledID,
      postPositive: postSentiment.post_positive,
      postNegative: postSentiment.post_negative,
    })
  },
}))

export default function PostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const postID = useSelectedLayoutSegment()
  const fetchPostContext = usePostContext((state) => state.fetch)
  const fetchPostStore = usePostStore((state) => state.fetch)

  useEffect(() => {
    fetchPostContext()
    if (postID) fetchPostStore(postID as PostSentimentType)
  })

  return (
    <main className={styles.layout}>
      {children}
      <PostSider />
      <PostHeader />
      <PostFooter />
    </main>
  )
}

function PostHeader() {
  const postID = useSelectedLayoutSegment()
  const filename = usePostContext((state) => state.filename)
  const postIDList = usePostContext((state) => state.postIDList)
  return (
    <div className={styles.header}>
      <div className={styles.toolbar}>
        <>
          <ArrowDownTrayIcon />
          <CloudArrowUpIcon />
          <PresentationChartBarIcon />
        </>
        <div className={styles.label}>{filename}</div>
      </div>
      <div className={styles.select}>
        <Link className={styles.button} href={`/post/${postID}`}>
          {postID}&nbsp;
          <ChevronDownIcon className={styles.icon} />
        </Link>
        <div className={styles.menu}>
          {postIDList &&
            postIDList.map((id) => (
              <Link key={id} className={styles.option} href={`/post/${id}`}>
                {id}
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}

function PostFooter() {
  const prevID = usePostStore((state) => state.prevID)
  const nextID = usePostStore((state) => state.nextID)
  const prevUnlabeledID = usePostStore((state) => state.prevUnlabeledID)
  const nextUnlabeledID = usePostStore((state) => state.nextUnlabeledID)
  return (
    <div className={styles.footer}>
      <Link
        className={prevUnlabeledID ? '' : styles.disabled}
        href={`/post/${prevUnlabeledID}`}
      >
        <ChevronDoubleLeftIcon />
      </Link>
      <Link className={prevID ? '' : styles.disabled} href={`/post/${prevID}`}>
        <ChevronLeftIcon />
      </Link>
      <Link className={nextID ? '' : styles.disabled} href={`/post/${nextID}`}>
        <ChevronRightIcon />
      </Link>
      <Link
        className={nextUnlabeledID ? '' : styles.disabled}
        href={`/post/${nextUnlabeledID}`}
      >
        <ChevronDoubleRightIcon />
      </Link>
    </div>
  )
}

function PostSider() {
  const postPositive = usePostStore((state) => state.postPositive)
  const postNegative = usePostStore((state) => state.postNegative)
  return (
    <div className={styles.sider}>
      <div className={styles.select}>
        <PlusIcon className={styles.button} />
        <PostSentimentMenu initialSentiment={postPositive} target="positive" />
      </div>
      <div className={styles.select}>
        <MinusIcon className={styles.button} />
        <PostSentimentMenu initialSentiment={postNegative} target="negative" />
      </div>
    </div>
  )
}

function PostSentimentMenu({
  initialSentiment,
  target,
}: {
  initialSentiment: PostSentimentType
  target: 'positive' | 'negative'
}) {
  const setPostNegative = usePostStore((state) => state.setPostNegative)
  const setPostPositive = usePostStore((state) => state.setPostPositive)
  const [sentiment, setSentiment] = useState(initialSentiment)
  return (
    <div className={styles.menu}>
      {PostSentimentOptions.map(
        (option: string) =>
          option && (
            <div
              key={option}
              className={
                styles.option +
                (sentiment === option ? ' ' + styles.selected : '')
              }
              onClick={() => {
                setSentiment(option as PostSentimentType)
                if (target === 'positive') {
                  setPostPositive(option as PostSentimentType)
                } else if (target === 'negative') {
                  setPostNegative(option as PostSentimentType)
                }
              }}
            >
              {option}
              {sentiment === option && (
                <span className={styles.check}>
                  <CheckIcon className={styles.icon} />
                </span>
              )}
            </div>
          )
      )}
    </div>
  )
}
