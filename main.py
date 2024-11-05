from fastapi import FastAPI, Request
from pydantic import BaseModel, Field
from typing import List, Optional
import ollama

app = FastAPI()


class Option(BaseModel):
    value: str
    text: str


class ElemData(BaseModel):
    label: str
    options: Optional[List[Option]] = None
    selector: str


@app.post("/autocompletes/selects")
async def receive_data(element: ElemData):
    response = ollama.chat(
        model='qwen2.5-coder:7b-instruct',
        messages=[
            {
                'role': 'system',
                'content': f"""
                Given a users personal information you will choose the correct option based on a LABEL and OPTIONS.
                **User Information**
                - user has never been disabled. disabled: never
                - user is white. white: yes
                - user is not hispanic. hispanic: no
                - user is male. gender: male
                - user is not veteran. veteran: no
                - user uses he/him. pronouns: he him

                Respond with the appropriate value only with no extra words.
                """
            },
            {
                'role': 'user',
                'content': '''
                    LABEL: Gender
                    OPTIONS: [{"value": "male", "text": "Male"}, {"value": "female", "text": "Female"}]
                    '''
            },
            {
                'role': 'assistant',
                'content': "male",
            },
            {
                'role': 'user',
                'content': '''
                    LABEL: Race Ethnicity
                    OPTIONS: [
                        {"value": "white", "text": "White"},
                        {"value": "black", "text": "Black"},
                        {"value": "asian", "text": "Asian"},
                        {"value": "hispanic", "text": "Hispanic"}
                    ]
                    '''
            },
            {
                'role': 'assistant',
                'content': "white",
            },
            {
                'role': 'user',
                'content': f'''
                    LABEL: {element.label}
                    OPTIONS: {element.options}
                    '''
            }
        ],
        stream=False,
    )

    return {"selector": element.selector, "choice": response['message'].get('content')}
