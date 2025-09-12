import fetch from 'node-fetch';

export default async function handler(req, res) {
  const owner = "var-github";  // Replace with your GitHub repo owner
  const repo = "var-github.github.io";  // Replace with your repo name
  const workflowFile = "keep_app_up.yaml";  // Your workflow file name
  const branch = "main";  // Branch to trigger the workflow on
  const token = process.env.TOKEN;  // GitHub PAT set as Vercel environment variable

  const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowFile}/dispatches`;

  const headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  const data = {
    ref: branch,
    inputs: {
      urls: '["https://varun-sudoku-solver.streamlit.app/", "https://lane-detection.streamlit.app/", "https://acmtranslator.streamlit.app/", "https://varun-acm-gen-ai-project.streamlit.app"]'
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });

    if (response.status === 204) {
      res.status(200).json({ message: "Workflow triggered successfully!" });
    } else {
      const errorText = await response.text();
      res.status(response.status).json({ error: errorText });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
