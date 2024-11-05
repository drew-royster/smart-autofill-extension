# Smart Autofill Extension

**work in progress, only works for me so far**

## Goal
Build an identity based autocomplete extension which can help you quickly fill out any form while you're browsing. Think 1password, but supporting more fields types

## What's working

- [x] Selects
- [ ] Checkboxes
- [ ] Radio
- [ ] Text

## To Run

1. Load the extension
2. Install [ollama](https://ollama.com)
3. With ollama pull `qwen2.5-coder:7b-instruct`
4. Modify main.py to reflect your demographic information *will improve later*
5. `pip install -r requirements.txt`
6. `fastapi dev main.py --port 8000`
7. Load up a job application page with demographic information questions
