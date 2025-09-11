from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support import expected_conditions as EC
from concurrent.futures import ThreadPoolExecutor

LINK_SELECTOR = 'a[href="https://share.streamlit.io/user/var-github"]'

def automate_website(url):
    options = Options()
    options.add_argument('--headless=new')  # headless mode
    options.add_argument('--no-sandbox')  # for container env
    options.add_argument('--disable-dev-shm-usage')  # resource issues workaround
    driver = webdriver.Chrome(options=options)
    driver.get(url)
    try:
        wait = WebDriverWait(driver, 60)
        button = wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, f"button, {LINK_SELECTOR}"))
        )
        if button.get_attribute("innerHTML") == "Yes, get this app back up!":
            button.click()
            wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, LINK_SELECTOR)))
    except Exception as e:
        print(f"Exception occurred on {url}: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    urls = [
        "https://varun-sudoku-solver.streamlit.app/",
        "https://lane-detection.streamlit.app/",
        "https://acmtranslator.streamlit.app/"
    ]

    with ThreadPoolExecutor(max_workers=len(urls)) as executor:
        executor.map(automate_website, urls)

    print("Automation complete on all URLs.")
