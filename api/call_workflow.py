import requests
import os

def handler(request, response):
    owner = "var-github"
    repo = "var-github.github.io"
    workflow_file = "keep_app_up.yaml"
    branch = "main"
    token = os.environ.get("TOKEN")

    url = f"https://api.github.com/repos/{owner}/{repo}/actions/workflows/{workflow_file}/dispatches"

    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
    }

    data = {
        "ref": branch,
        "inputs": {
            "urls": '["https://varun-sudoku-solver.streamlit.app/", "https://lane-detection.streamlit.app/", "https://acmtranslator.streamlit.app/", "https://varun-acm-gen-ai-project.streamlit.app"]'
        }
    }

    resp = requests.post(url, headers=headers, json=data)

    if resp.status_code == 204:
        response.status_code = 200
        response.body = "Workflow triggered successfully!"
    else:
        response.status_code = resp.status_code
        response.body = resp.text
