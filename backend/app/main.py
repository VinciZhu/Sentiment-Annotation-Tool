import os
import pandas as pd
from fastapi import FastAPI

DATA_PATH = os.getenv('DATA_PATH')
df = pd.read_csv(DATA_PATH, index_col=0, keep_default_na=False)

app = FastAPI()


@app.get('/')
def default():
    return {'filename': os.path.basename(DATA_PATH)}


@app.get('/post_id_list')
def post_id_list():
    return {'post_id_list': df['post_id'].unique().tolist()}


@app.get('/comment_indices')
def comment_indices(post_id: str):
    return {'comment_indices': df[df['post_id'] == post_id].index.tolist()}


@app.get('/comment')
def comment(index: int):
    return df.loc[index].to_dict()


@app.get('/next_post_id')
def next_post_id():
    return {
        'next_post_id': df[
            (df['Comment Sentiment'] == '')
            & (df['Post Positive'] == '')
            & (df['Post Negative'] == '')
        ].iloc[0]['post_id']
    }


@app.get('/next_post')
def next_post():
    temp = next_post_id()
    return temp | comment_indices(temp['next_post_id'])
