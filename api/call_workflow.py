import requests

owner = "var-github"  # Replace with your GitHub repo owner
repo = "var-github.github.io"    # Replace with your repo name
workflow_file = "keep_app_up.yaml"  # Your workflow file name
branch = "main"  # Branch to trigger the workflow on
token = "TOKEN"  # Your GitHub PAT

url = f"https://api.github.com/repos/{owner}/{repo}/actions/workflows/{workflow_file}/dispatches"

headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": f"Bearer {token}",
}

data = {
    "ref": branch,
    "inputs": {"urls": '["https://varun-sudoku-solver.streamlit.app/", "https://lane-detection.streamlit.app/", "https://acmtranslator.streamlit.app/", "https://varun-acm-gen-ai-project.streamlit.app"]'}
}
"""
response = requests.post(url, headers=headers, json=data)

if response.status_code == 204:
    print("Workflow triggered successfully!")
else:
    print(f"Failed to trigger workflow: {response.status_code}")
    print(response.text)
"""
print("Hi")
