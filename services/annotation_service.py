# Annotation collaborative - Python (FastAPI placeholder)
from fastapi import FastAPI, Request
app = FastAPI()
@app.post('/annotate')
async def annotate(data: Request):
    # TODO: Intégrer workflow annotation collaborative
    return {'annotation': 'Annotation simulée', 'trace': 'to-add'}
