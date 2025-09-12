<details>
<summary><code>Creating serverless function that can be called via POST method</code></summary>
<br>
We are creating a serverless function called call_workflow.js
To do this create new project in vercel - choose repo

- Set Framework preset to OTHER
- Leave build command and output directory empty
- Add any envirnment secrets you want to add and deploy

If you are using any packages, you need to create package.json

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
export default async function handler(req, res) {
}
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

Finally set response status to complete API call
</details>
