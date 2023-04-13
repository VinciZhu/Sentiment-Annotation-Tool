import os
from datetime import datetime
import pandas as pd
from pandas_profiling import ProfileReport
from fastapi import FastAPI
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware


FRONTEND_HOST = os.getenv('NEXTJS_HOST')
FRONTEND_PORT = os.getenv('NEXTJS_PORT')
FRONTEND_URL = f'http://{FRONTEND_HOST}:{FRONTEND_PORT}'

DATA_PATH = os.getenv('DATA_PATH')
df = pd.read_csv(DATA_PATH, index_col=0, keep_default_na=False)
df.rename(
    columns={
        'Comment Sentiment': 'comment_sentiment',
        'Post Positive': 'post_positive',
        'Post Negative': 'post_negative',
    },
    inplace=True,
)


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
)


@app.get('/')
def get_filename():
    return {'filename': os.path.basename(DATA_PATH)}


@app.get('/post_id_list')
def get_post_id_list():
    return {'post_id_list': df['post_id'].unique().tolist()}


@app.get('/comments/{post_id}')
def get_comments(post_id: str):
    return {
        'child_indices': df[
            (df['post_id'] == post_id) & (df['parent'] == -1)
        ].index.tolist(),
        'count': df[(df['post_id'] == post_id)].shape[0],
    }


@app.get('/children/{parent_index}')
def get_child_indices(parent_index: int):
    return {'children': df[df['parent'] == parent_index].index.tolist()}


@app.get('/comment/{index}')
def comment(index: int):
    return df.loc[index, ['content', 'time_stamp']].to_dict()


@app.get('/comment_sentiment/{index}')
def get_comment_sentiment(index: int):
    return df.loc[index, ['comment_sentiment']].to_dict()


@app.post('/update_comment_sentiment/{index}')
def update_comment_sentiment(index: int, sentiment: str):
    df.at[index, 'comment_sentiment'] = sentiment
    return {'success': True}


@app.get('/post_sentiment/{post_id}')
def get_post_sentiment(post_id: str):
    return (
        df[['post_positive', 'post_negative']]
        .loc[df['post_id'] == post_id]
        .iloc[0]
        .to_dict()
    )


@app.post('/update_post_sentiment/{post_id}')
def update_post_sentiment(post_id: str, positive: str, negative: str):
    df.loc[df['post_id'] == post_id, 'post_positive'] = positive
    df.loc[df['post_id'] == post_id, 'post_negative'] = negative
    return {'success': True}


@app.post('/update_post_positive/{post_id}')
def update_post_positive(post_id: str, positive: str):
    df.loc[df['post_id'] == post_id, 'post_positive'] = positive
    return {'success': True}


@app.post('/update_post_negative/{post_id}')
def update_post_negative(post_id: str, negative: str):
    df.loc[df['post_id'] == post_id, 'post_negative'] = negative
    return {'success': True}


@app.get('/next_post')
def get_next_post_id(cur_id: str, unlabeled_only: bool):
    if unlabeled_only:
        id_list = (
            df.loc[
                (df['comment_sentiment'] == '')
                | (df['post_positive'] == '')
                | (df['post_negative'] == '')
                | (df['post_id'] == cur_id),
                'post_id',
            ]
            .unique()
            .tolist()
        )
    else:
        id_list = df['post_id'].unique().tolist()
    if cur_id == '':
        return {'id': id_list[0]}
    if cur_id not in id_list:
        return {'id': ''}
    cur_index = id_list.index(cur_id)
    next_id = id_list[cur_index + 1] if cur_index < len(id_list) - 1 else ''
    return {'id': next_id}


@app.get('/prev_post')
def get_prev_post_id(cur_id: str, unlabeled_only: bool):
    if unlabeled_only:
        id_list = (
            df.loc[
                (df['comment_sentiment'] == '')
                | (df['post_positive'] == '')
                | (df['post_negative'] == '')
                | (df['post_id'] == cur_id),
                'post_id',
            ]
            .unique()
            .tolist()
        )
    else:
        id_list = df['post_id'].unique().tolist()
    if cur_id == '':
        return {'id': id_list[-1]}
    if cur_id not in id_list:
        return {'id': ''}
    cur_index = id_list.index(cur_id)
    prev_id = id_list[cur_index - 1] if cur_index > 0 else ''
    return {'id': prev_id}


@app.post('/save')
def save():
    df.to_csv(DATA_PATH)
    return {'success': True}


@app.get('/download', response_class=FileResponse)
def download():
    filename = f'{datetime.now().strftime("%Y-%m-%d-%H%M%S")}.csv'
    df.to_csv(filename)
    return filename


@app.get('/report', response_class=HTMLResponse)
def report():
    title = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    report = ProfileReport(
        df[['comment_sentiment', 'post_positive', 'post_negative']], title=title
    )
    return report.to_html()
