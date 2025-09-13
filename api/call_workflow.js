async function handler(req, res) {
  const owner = "var-github";  // GitHub repo owner
  const repo = "var-github.github.io";  // Repo name
  const workflowFile = "keep_app_up.yaml";  // Workflow file name
  const branch = "main";  // Branch to trigger the workflow on
  const token = process.env.access_token;  // GitHub PAT access token

  let url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowFile}/dispatches`;

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

  // Run workflow
  const dispatchResp = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });

  if (dispatchResp.status !== 204) {
    const errorText = await dispatchResp.text();
    return res.status(dispatchResp.status).json({ error: errorText });
  }

  // Wait until workflow finished running
  await new Promise(r => setTimeout(r, 15000));

  // URL to get workflow runs
  url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowFile}/runs?branch=${branch}`;
  let pollAttempts = 0;
  const maxPoll = 20; // Wait up to 100 seconds (20 x 5s)

  let foundRun = false;

  while (pollAttempts < maxPoll) {
    pollAttempts++;
    const runsResp = await fetch(url, { headers });    
    const runsData = await runsResp.json();
    // check status of latest run
    if (runsData.workflow_runs[0].status == "completed") {
      foundRun = true;
      break;
    }
    await new Promise(r => setTimeout(r, 5000));
  }

  if (!foundRun) {
    return res.status(408).json({error: "Workflow run did not complete in the timeout period"});
  }
  res.status(200).json({message: 'Workflow completed'});
}
module.exports = handler;
