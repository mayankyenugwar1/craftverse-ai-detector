import requests
import re

html_url = "https://amazing-sawine-a87e09.netlify.app/"
print("Fetching Netlify HTML:", html_url)
r_home = requests.get(html_url, timeout=10)

script_match = re.search(r'src="(/assets/index-[^"]+\.js)"', r_home.text)
if script_match:
    js_url = "https://amazing-sawine-a87e09.netlify.app" + script_match.group(1)
    print("Fetching JS bundle:", js_url)
    r_js = requests.get(js_url, timeout=15)
    
    # Find all API/HTTP URLs in the JS bundle
    urls = set(re.findall(r'https?://[^\s"\'`<>]+', r_js.text))
    print("\nHTTP URLs found in bundle:")
    for u in urls:
        print("  -", u)

    # Find axios baseURL / endpoints
    api_matches = re.findall(r'(\w+:\s*"[^"]*analyze[^"]*")', r_js.text)
    print("\nAPI analyze references:")
    for m in api_matches[:10]:
        print("  -", m)
else:
    print("Script tag not found in HTML!")
