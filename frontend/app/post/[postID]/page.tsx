import styles from '@/styles/post.module.css'
import {
  getComments,
  getComment,
  getChildren,
  getCommentSentiment,
} from '@/api/post'
import CommentBody from './CommentBody'
import { Suspense } from 'react'
export default Main

async function Main({ params }: { params: { postID: string } }) {
  const { child_indices } = await getComments(params.postID)
  return (
    <div className={styles.content}>
      {/* @ts-expect-error Server Component */}
      <Subcomments indices={child_indices} />
    </div>
  )
}

async function Comment({ index }: { index: number }) {
  const [comment, children, sentiment] = await Promise.all([
    getComment(index),
    getChildren(index),
    getCommentSentiment(index),
  ])
  return (
    <>
      <CommentBody
        index={index}
        content={comment.content}
        timeStamp={comment.time_stamp}
        initialSentiment={sentiment}
      />
      {/* @ts-expect-error Server Component */}
      <Subcomments indices={children} />
    </>
  )
}

async function Subcomments({ indices }: { indices: number[] }) {
  return (
    <>
      {indices.map((index) => (
        <Suspense key={index} fallback={<></>}>
          <div key={index} className={styles.comment}>
            {/* @ts-expect-error Server Component */}
            <Comment index={index} />
          </div>
        </Suspense>
      ))}
    </>
  )
}
