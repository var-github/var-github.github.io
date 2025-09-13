<details>
<summary><code>Creating serverless function that can be called via POST method</code></summary>
<br>
We are creating a serverless function called call_workflow.js
To do this create new project in vercel - choose repo

- Set Framework preset to OTHER
- Leave build command and output directory empty
- Add any envirnment secrets you want to add and deploy

If you are using any js packages, you need to create package.json

Structure of package.json if required
```
{
  "name": "Name",  
  "version": "1.0.0",  
  "description": "Description",  
  "main": "api/<INSERT JS file name here>.js",  
  "dependencies": {  
    "<module name>": "<version>"    
  }  
}
```

All your code should be inside this function
```
async function handler(req, res) {
   // Code to be executed comes here
}
module.exports = handler;
```
Your entire code will be called by a POST method, therefore to set status after run, use
- **res.status(200) or res.status(500)**

To send some message along with status
- **res.status(200).json(\<Pass any json data here>);**

After succesfully deploying, you can now call your serverless function by sending a POST request to the URL provided by vercel
</details>

<details>
<summary><code>Running a github workflow programatically</code></summary>
<br>
First create a GitHub workflow, which runs on 'workflow_dispatch'

You need to create a Personal Access Token
- Go to Settings
- Developer settings
- Personal access tokens (choose - Tokens (classic))
- Generate new token, give access to all repos and workflows
- Copy access token

```
https://api.github.com/repos/<repo owner>/<repo name>/actions/workflows/<workflowFile name>/dispatches

const headers = {
  "Accept": "application/vnd.github+json",
  "Authorization": 'Bearer <Github PAT access token>',
  "Content-Type": "application/json"
};
```
Setting up data to pass to URL

ref: pass the branch in github on which you want to run workflow
```
const data = {
  ref: 'main',
  inputs: {
    <put variable name here>: 'pass data here'
  }
};
```
Sending POST request to URL
```
const response = await fetch(url, {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(data)
});
```

This call runs the github workflow
Finally set response status to complete API call
</details>
<details>
<summary><code>Explaination of 'call_workflow.js'</code></summary>
<br>
In my case, I am using the workflow to keep streamlit apps up. Streamlit apps dont go down until 3 hours of inactivity, since we dont want to run workflow on every refresh - poll the last time the workflow ran.

If workflow ran more than 3 hours ago only then run new instance of workflow
```
const runsUrl = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowFile}/runs?branch=${branch}`;

let latestRunTime = null;
const runsResp = await fetch(runsUrl, { headers });
const runsData = await runsResp.json();

latestRunTime = runsData.workflow_runs[0].created_at;  // ISO8601 string
const lastRunDate = new Date(latestRunTime);
```
Now compare with current time and decide weather to run workflow

<br>
**Run workflow as per syntax given above**

<br>
Now we want to wait till workflow finished running, so that we can send completed response to API call. To do this periodically call Github API and check if run status == "completed"
```
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
```
</details>
