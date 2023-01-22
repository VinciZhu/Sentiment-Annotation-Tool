import styles from '@/styles/post.module.css'
import {
  getComments,
  getComment,
  getChildren,
  getCommentSentiment,
} from '@/api/post'
import MarkdownIt from 'markdown-it'
import CommentBody from '@/client/CommentBody'
export default Main

const md = new MarkdownIt()

async function Main({ params }: { params: { post_id: string } }) {
  const { child_indices } = await getComments(params.post_id)
  return (
    <div className={styles.content}>
      {child_indices.map((index) => (
        <div key={index} className={styles.comment}>
          {/* @ts-expect-error Server Component */}
          <Comment index={index} />
        </div>
      ))}
    </div>
  )
}

async function Comment({ index }: { index: number }) {
  const comment = await getComment(index)
  const children = await getChildren(index)
  const sentiment = await getCommentSentiment(index)
  return (
    <>
      <CommentBody
        index={index}
        content={md.render(comment.content)}
        timeStamp={comment.time_stamp}
        initialSentiment={sentiment}
      />
      {children.map((index) => (
        <div key={index} className={styles.comment}>
          {/* @ts-expect-error Server Component */}
          <Comment index={index} />
        </div>
      ))}
    </>
  )
}
