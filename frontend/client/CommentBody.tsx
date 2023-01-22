'use client'
import styles from '@/styles/post.module.css'
import { baseurl, updateCommentSentiment } from '@/api/post'
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
export default CommentBody

function CommentBody({
  index,
  content,
  timeStamp,
  initialSentiment,
}: {
  index: number
  content: string
  timeStamp: string
  initialSentiment: string
}) {
  const [sentiment, setSentiment] = useState(initialSentiment)
  let sentimentClass = ''
  switch (sentiment) {
    case 'Positive':
      sentimentClass = styles.positive
      break
    case 'Negative':
      sentimentClass = styles.negative
      break
    case 'N/A':
      sentimentClass = styles.neutral
      break
  }
  return (
    <>
      <div className={styles.comment_top}>
        <div
          className={styles.neutral_button}
          onClick={() => {
            updateCommentSentiment(index, 'N/A')
            setSentiment('N/A')
          }}
        />
        <p>{timeStamp}</p>
        <a className={styles.comment_link} href={`${baseurl}/comment/${index}`}>
          <span className={sentimentClass}>{index}</span>
          &nbsp;
          <ArrowUpOnSquareIcon className={styles.icon} />
        </a>
      </div>
      <div className={styles.comment_body}>
        <div
          className={styles.positive_button}
          onClick={() => {
            updateCommentSentiment(index, 'Positive')
            setSentiment('Positive')
          }}
        />
        <div
          className={styles.negative_button}
          onClick={() => {
            updateCommentSentiment(index, 'Negative')
            setSentiment('Negative')
          }}
        />
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </>
  )
}
