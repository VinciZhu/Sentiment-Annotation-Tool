import os
from dotenv import load_dotenv

load_dotenv('../.env.local')
load_dotenv('../.env')
FASTAPI_HOST = os.getenv('FASTAPI_HOST')
FASTAPI_PORT = os.getenv('FASTAPI_PORT')


def dev():
    cmd = [
        'poetry run',
        'uvicorn',
        'app.main:app',
        '--reload',
        f'--host {FASTAPI_HOST}',
        f'--port {FASTAPI_PORT}',
    ]
    os.system(' '.join(cmd))


def start():
    cmd = [
        'poetry run',
        'gunicorn',
        'app.main:app',
        '-w 4',
        '-k uvicorn.workers.UvicornWorker',
        f'-b {FASTAPI_HOST}:{FASTAPI_PORT}',
    ]
    os.system(' '.join(cmd))


def lint():
    cmd = [
        'poetry run',
        'ruff .',
    ]
    os.system(' '.join(cmd))
