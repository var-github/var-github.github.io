async function handler(req, res) {
  const owner = "var-github";  // GitHub repo owner
  const repo = "var-github.github.io";  // Repo name
  const workflowFile = "keep_app_up.yaml";  // Workflow file name
  const branch = "main";  // Branch to trigger the workflow on
  const token = process.env.access_token;  // GitHub PAT access token

  const runsUrl = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowFile}/runs?branch=${branch}`;
  const dispatchUrl = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowFile}/dispatches`;

  const headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  const data = {
    ref: branch
  };

  /* If you want to pass any input to github workflow
  const data = {
    ref: branch,
    inputs: {
      urls: 'DATA TO PASS'
    }
  };
  */
  
  // Get latest workflow run time
  let latestRunTime = null;
  const runsResp = await fetch(runsUrl, { headers });
  const runsData = await runsResp.json();
  latestRunTime = runsData.workflow_runs[0].created_at;  // ISO8601 string
      
  // Check if enough time has elapsed (30 minutes)
  const lastRunDate = new Date(latestRunTime);
  const now = new Date();
  const diffMinutes = (now - lastRunDate) / (1000 * 60);
  if (diffMinutes < 180) {
    return res.status(200).json({message: 'Workflow triggered recently'});
  }

  // Run workflow
  const dispatchResp = await fetch(dispatchUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });

  // Wait until workflow finished running
  await new Promise(r => setTimeout(r, 15000));
  let pollAttempts = 0;
  const maxPoll = 20; // Wait up to 100 seconds (20 x 5s)

  let foundRun = false;

  while (pollAttempts < maxPoll) {
    pollAttempts++;
    const runsResp = await fetch(runsUrl, { headers });    
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
