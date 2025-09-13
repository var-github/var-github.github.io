<details>
<summary><code>Hosting website with Github Pages</code></summary>
<br>
</details>
<details>
<summary><code>Creating a python workflow to keep streamlit apps up</code></summary>
<br>

To create a github workflow, first create a .yaml file in .github/workflows. In my case I have configured the workflow to run <ins>script.py</ins>

- script.py first reads what websites to keep active from <ins>projects_to_display.json</ins>
- Then it opens all websites using selenium and searches the webpage for the button to wake up app
- It clicks the button if present
- Then it waits for website to load (If you exit app immediately after clicking button, the click does not register)
- After website loads - it closes the websites
- To save time it opens all websites in parallel using 'ThreadPoolExecutor'
</details>
<details>
<summary><code>Hosting a serverless function to call workflow programmatically</code></summary>
<br>

Read more at [var-github.github.io/api](https://github.com/var-github/var-github.github.io/tree/main/api)
</details>
