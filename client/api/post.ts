export const baseurl = process.env.API_URL

async function fetchRetry(
  url: string,
  options: any = {},
  minDelay: number = 1000,
  maxRetryCount: number = 3,
  curRetryCount: number = 0
): Promise<Response> {
  return fetch(url, options).catch((error) => {
    if (curRetryCount >= maxRetryCount) {
      // console.log(`Retrying ${url} failed`)
      console.log(error)
      throw error
    }
    const delay = (Math.pow(2, curRetryCount) * Math.random() + 1) * minDelay // exponential backoff
    // console.log(
    //   `Retrying ${url} for ${curRetryCount + 1} time(s) in ${delay} ms`
    // )
    return new Promise((resolve) => setTimeout(resolve, delay)).then(() =>
      fetchRetry(url, options, minDelay, maxRetryCount, curRetryCount + 1)
    )
  })
}

export async function getPostIDList(): Promise<string[]> {
  return fetchRetry(`${baseurl}/post_id_list`)
    .then((res) => res.json())
    .then((data) => data.post_id_list)
}

export async function getFilename(): Promise<string> {
  return fetchRetry(`${baseurl}/`)
    .then((res) => res.json())
    .then((data) => {
      return data.filename
    })
}

export async function getPrevPostID(cur_id: string = ''): Promise<string> {
  return fetchRetry(
    `${baseurl}/prev_post?cur_id=${cur_id}&unlabeled_only=false`
  )
    .then((res) => res.json())
    .then((data) => data.id)
}

export async function getNextPostID(cur_id: string = ''): Promise<string> {
  return fetchRetry(
    `${baseurl}/next_post?cur_id=${cur_id}&unlabeled_only=false`
  )
    .then((res) => res.json())
    .then((data) => data.id)
}

export async function getPrevUnlabeledPostID(
  cur_id: string = ''
): Promise<string> {
  return fetchRetry(
    `${baseurl}/prev_post?cur_id=${cur_id}&unlabeled_only=true`,
    {
      next: { revalidate: 0 },
    }
  )
    .then((res) => res.json())
    .then((data) => data.id)
}

export async function getNextUnlabeledPostID(
  cur_id: string = ''
): Promise<string> {
  return fetchRetry(
    `${baseurl}/next_post?cur_id=${cur_id}&unlabeled_only=true`,
    {
      next: { revalidate: 0 },
    }
  )
    .then((res) => res.json())
    .then((data) => data.id)
}

export async function getComments(post_id: string): Promise<{
  child_indices: number[]
  count: number
}> {
  return fetchRetry(`${baseurl}/comments/${post_id}`).then((res) => res.json())
}

export async function getChildren(index: number): Promise<number[]> {
  return fetchRetry(`${baseurl}/children/${index}`)
    .then((res) => res.json())
    .then((data) => data.children)
}

import MarkdownIt from 'markdown-it'
export async function getComment(index: number): Promise<{
  content: string
  time_stamp: string
}> {
  const md = new MarkdownIt()
  return fetchRetry(`${baseurl}/comment/${index}`)
    .then((res) => res.json())
    .then((data) => {
      data.content = md.render(data.content)
      return data
    })
}

export async function getCommentSentiment(index: number): Promise<string> {
  return fetchRetry(`${baseurl}/comment_sentiment/${index}`, {
    next: { revalidate: 0 },
  }).then((res) => res.json().then((data) => data.comment_sentiment))
}

export async function updateCommentSentiment(
  index: number,
  sentiment: '' | 'Positive' | 'Negative' | 'N/A'
): Promise<Response> {
  return fetchRetry(
    `${baseurl}/update_comment_sentiment/${index}?sentiment=${sentiment}`,
    { method: 'POST' }
  )
}

export const PostSentimentOptions = [
  '',
  'Very likely',
  'Somewhat likely',
  'Neutral',
  'Unlikely',
  'Very unlikely',
]
export type PostSentimentType =
  | ''
  | 'Very likely'
  | 'Somewhat likely'
  | 'Neutral'
  | 'Unlikely'
  | 'Very unlikely'
export async function getPostSentiment(post_id: string): Promise<{
  post_positive: PostSentimentType
  post_negative: PostSentimentType
}> {
  return fetchRetry(`${baseurl}/post_sentiment/${post_id}`).then((res) =>
    res.json()
  )
}

export async function updatePostSentiment(
  post_id: string,
  positive: PostSentimentType,
  negative: PostSentimentType
): Promise<Response> {
  return fetchRetry(
    `${baseurl}/update_post_sentiment/${post_id}?positive=${positive}&negative=${negative}`,
    { method: 'POST' }
  )
}

export async function updatePostPositive(
  post_id: string,
  positive: PostSentimentType
): Promise<Response> {
  return fetchRetry(
    `${baseurl}/update_post_positive/${post_id}?positive=${positive}`,
    { method: 'POST' }
  )
}

export async function updatePostNegative(
  post_id: string,
  negative: PostSentimentType
): Promise<Response> {
  return fetchRetry(
    `${baseurl}/update_post_negative/${post_id}?negative=${negative}`,
    { method: 'POST' }
  )
}

export async function saveDataframe() {
  return fetchRetry(`${baseurl}/save`, { method: 'POST' })
}

export async function downloadDataframe() {
  return fetchRetry(`${baseurl}/download`)
}
