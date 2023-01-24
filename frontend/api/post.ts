import MarkdownIt from 'markdown-it'
const md = new MarkdownIt()

export const baseurl = process.env.API_URL

export async function getPostIDList(): Promise<string[]> {
  return fetch(`${baseurl}/post_id_list`)
    .then((res) => res.json())
    .then((data) => data.post_id_list)
}

export async function getFilename(): Promise<string> {
  return fetch(`${baseurl}/`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      return data.filename
    })
}

export async function getPrevPostID(cur_id: string = ''): Promise<string> {
  return fetch(`${baseurl}/prev_post?cur_id=${cur_id}&unlabeled_only=false`)
    .then((res) => res.json())
    .then((data) => data.id)
}

export async function getNextPostID(cur_id: string = ''): Promise<string> {
  return fetch(`${baseurl}/next_post?cur_id=${cur_id}&unlabeled_only=false`)
    .then((res) => res.json())
    .then((data) => data.id)
}

export async function getPrevUnlabeledPostID(
  cur_id: string = ''
): Promise<string> {
  return fetch(`${baseurl}/prev_post?cur_id=${cur_id}&unlabeled_only=true`, {
    cache: 'no-store',
  })
    .then((res) => res.json())
    .then((data) => data.id)
}

export async function getNextUnlabeledPostID(
  cur_id: string = ''
): Promise<string> {
  return fetch(`${baseurl}/next_post?cur_id=${cur_id}&unlabeled_only=true`, {
    cache: 'no-store',
  })
    .then((res) => res.json())
    .then((data) => data.id)
}

export async function getComments(post_id: string): Promise<{
  child_indices: number[]
  count: number
}> {
  return fetch(`${baseurl}/comments/${post_id}`).then((res) => res.json())
}

export async function getChildren(index: number): Promise<number[]> {
  return fetch(`${baseurl}/children/${index}`)
    .then((res) => res.json())
    .then((data) => data.children)
}

export async function getComment(index: number): Promise<{
  content: string
  time_stamp: string
}> {
  return fetch(`${baseurl}/comment/${index}`)
    .then((res) => res.json())
    .then((data) => {
      data.content = md.render(data.content)
      return data
    })
}

export async function getCommentSentiment(index: number): Promise<string> {
  return fetch(`${baseurl}/comment_sentiment/${index}`).then((res) =>
    res.json().then((data) => data.comment_sentiment)
  )
}

export async function updateCommentSentiment(
  index: number,
  sentiment: '' | 'Positive' | 'Negative' | 'N/A'
): Promise<Response> {
  return fetch(
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
  return fetch(`${baseurl}/post_sentiment/${post_id}`).then((res) => res.json())
}

export async function updatePostSentiment(
  post_id: string,
  positive: PostSentimentType,
  negative: PostSentimentType
): Promise<Response> {
  return fetch(
    `${baseurl}/update_post_sentiment/${post_id}?positive=${positive}&negative=${negative}`,
    { method: 'POST' }
  )
}

export async function updatePostPositive(
  post_id: string,
  positive: PostSentimentType
): Promise<Response> {
  return fetch(
    `${baseurl}/update_post_positive/${post_id}?positive=${positive}`,
    { method: 'POST' }
  )
}

export async function updatePostNegative(
  post_id: string,
  negative: PostSentimentType
): Promise<Response> {
  return fetch(
    `${baseurl}/update_post_negative/${post_id}?negative=${negative}`,
    { method: 'POST' }
  )
}

export async function saveDataframe() {
  return fetch(`${baseurl}/save`, {
    method: 'POST',
    mode: 'no-cors',
  })
}

export async function downloadDataframe() {
  return fetch(`${baseurl}/download`)
}
