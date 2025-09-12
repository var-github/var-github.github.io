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
