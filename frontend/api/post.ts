export const baseurl = process.env.FASTAPI_URL

export async function getPostIDList(): Promise<string[]> {
  return fetch(baseurl + '/post_id_list')
    .then((res) => res.json())
    .then((data) => data.post_id_list)
}

export async function getFilename(): Promise<string> {
  return fetch(`${baseurl}/`)
    .then((res) => res.json())
    .then((data) => data.filename)
}

export async function getPrevPostID(
  cur_id: string = '',
  unlabeled_only: boolean = false
): Promise<number> {
  return fetch(
    `${baseurl}/prev_post?cur_id=${cur_id}&unlabeled_only=${unlabeled_only}`
  )
    .then((res) => res.json())
    .then((data) => data.id)
}

export async function getNextPostID(
  cur_id: string = '',
  unlabeled_only: boolean = false
): Promise<number> {
  return fetch(
    `${baseurl}/next_post?cur_id=${cur_id}&unlabeled_only=${unlabeled_only}`
  )
    .then((res) => res.json())
    .then((data) => data.id)
}

export async function getComments(post_id: string): Promise<{
  child_indices: number[]
  count: number
}> {
  return fetch(`${baseurl}/comments/${post_id}`).then((res) => res.json())
}

export async function getComment(index: number): Promise<{
  content: string
  time_stamp: string
}> {
  return fetch(`${baseurl}/comment/${index}`).then((res) => res.json())
}

export async function getCommentSentiment(index: number): Promise<string> {
  return fetch(`${baseurl}/comment_sentiment/${index}`).then((res) =>
    res.json().then((data) => data.comment_sentiment)
  )
}

export async function getChildren(index: number): Promise<number[]> {
  return fetch(`${baseurl}/children/${index}`)
    .then((res) => res.json())
    .then((data) => data.children)
}

export async function getPostSentiment(post_id: string): Promise<{
  post_positive: string
  post_negative: string
}> {
  return fetch(`${baseurl}/post_sentiment/${post_id}`).then((res) => res.json())
}

export async function updateCommentSentiment(
  index: number,
  sentiment: string
): Promise<Response> {
  return fetch(
    `${baseurl}/update_comment_sentiment/${index}?sentiment=${sentiment}`,
    {
      method: 'POST',
      mode: 'no-cors',
    }
  )
}

export async function updatePostSentiment(
  post_id: string,
  positive: string,
  negative: string
): Promise<Response> {
  return fetch(
    `${baseurl}/update_post_sentiment/${post_id}?positive=${positive}&negative=${negative}`,
    {
      method: 'POST',
      mode: 'no-cors',
    }
  )
}
