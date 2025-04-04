import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from random_wait import random_wait  # Assuming you saved the previous function in random_wait.py

def make_reddit_request(url, headers):
    session = requests.Session()
    # Set up retry strategy: 3 retries with backoff
    retry_strategy = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504]
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("https://", adapter)
    
    try:
        response = session.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        print("Retrying after a random delay...")
        random_wait(1, 3)  # Wait 1-3 minutes
        return None  # Or retry again depending on your needs

# Example usage
url = "https://www.reddit.com/api/v1/access_token"
headers = {"User-Agent": "YourApp/1.0"}
result = make_reddit_request(url, headers)
if result:
    print("Success:", result)
