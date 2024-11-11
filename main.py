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


class RadioOption(BaseModel):
    value: str
    selector: str


class RadioData(BaseModel):
    options: Optional[List[RadioOption]] = None

@app.post("/autocompletes/selects")
async def receive_data(element: ElemData):
    options = ", ".join([e.value for e in element.options])

    response = ollama.chat(
        model='llama3.2:3b-instruct-q4_K_M',
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
                    OPTIONS: male, female
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
                    OPTIONS: white, black, asian, hispanic                   
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
                    OPTIONS: {options}
                    '''
            }
        ],
        stream=False,
    )

    return {"selector": element.selector, "choice": response['message'].get('content')}


@app.post("/autocompletes/radios")
async def receive_data(element: RadioData):
    print(element)
    options = ", ".join([e.value for e in element.options])

    response = ollama.chat(
        model='llama3.2:3b-instruct-q4_K_M',
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
                'content': 'male, female'
            },
            {
                'role': 'assistant',
                'content': "male",
            },
            {
                'role': 'user',
                'content': 'white, black, asian, hispanic'
            },
            {
                'role': 'assistant',
                'content': "white",
            },
            {
                'role': 'user',
                'content': options
            }
        ],
        stream=False,
    )

    choice = response['message'].get('content')
    selector = None
    for option in element.options:
        if option.value == choice:
            selector = option.selector
            break

    if selector is None:
        raise Exception("No selector found for choice")

    return {"selector": selector, "choice": choice}
