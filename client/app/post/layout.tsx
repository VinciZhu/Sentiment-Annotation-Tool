'use client'
import styles from '@/styles/post.module.css'
import {
  baseurl,
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
  saveDataframe,
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
  filename: string
  postIDList: string[]
  fetch: () => void
}

const usePostContext = create<PostContext>((set) => ({
  filename: '',
  postIDList: [],
  fetch: async () => {
    const [filename, postIDList] = await Promise.all([
      getFilename(),
      getPostIDList(),
    ])
    set({ filename, postIDList })
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

const usePostState = create<PostState>((set) => ({
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
  const fetchGlobalStore = usePostContext((state) => state.fetch)
  const fetchPostStore = usePostState((state) => state.fetch)

  useEffect(() => {
    fetchGlobalStore()
  })
  useEffect(() => {
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
        <a
          href={`${baseurl}/download`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ArrowDownTrayIcon />
        </a>
        <CloudArrowUpIcon
          onClick={() => {
            saveDataframe()
          }}
        />
        <a
          href={`${baseurl}/report`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <PresentationChartBarIcon />
        </a>
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
  const prevID = usePostState((state) => state.prevID)
  const nextID = usePostState((state) => state.nextID)
  const prevUnlabeledID = usePostState((state) => state.prevUnlabeledID)
  const nextUnlabeledID = usePostState((state) => state.nextUnlabeledID)
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
  return (
    <div className={styles.sider}>
      <div className={styles.select}>
        <PlusIcon className={styles.button} />
        <PostSentimentMenu target="positive" />
      </div>
      <div className={styles.select}>
        <MinusIcon className={styles.button} />
        <PostSentimentMenu target="negative" />
      </div>
    </div>
  )
}

function PostSentimentMenu({ target }: { target: 'positive' | 'negative' }) {
  const postPositive = usePostState((state) => state.postPositive)
  const postNegative = usePostState((state) => state.postNegative)
  const initialSelected = target === 'positive' ? postPositive : postNegative
  const [selected, setSelected] = useState<PostSentimentType>('')
  const setPostPositive = usePostState((state) => state.setPostPositive)
  const setPostNegative = usePostState((state) => state.setPostNegative)
  useEffect(() => {
    setSelected(initialSelected)
  }, [initialSelected])
  return (
    <div className={styles.menu}>
      {PostSentimentOptions.map(
        (option: string) =>
          option && (
            <div
              key={option}
              className={
                styles.option +
                (selected === option ? ' ' + styles.selected : '')
              }
              onClick={() => {
                setSelected(option as PostSentimentType)
                if (target === 'positive') {
                  setPostPositive(option as PostSentimentType)
                } else if (target === 'negative') {
                  setPostNegative(option as PostSentimentType)
                }
              }}
            >
              {option}
              {selected === option && (
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
