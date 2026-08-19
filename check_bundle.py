import requests
import time
import re

print("Polling Netlify for index-dO3smCJJ.js...")
for i in range(1, 10):
    try:
        r = requests.get("https://amazing-sawine-a87e09.netlify.app/", timeout=10)
        match = re.search(r'index-[^"]+\.js', r.text)
        current_script = match.group(0) if match else "None"
        print(f"Attempt {i}: Active bundle -> {current_script}")
        if current_script == "index-dO3smCJJ.js":
            print("\n✓ SUCCESS: Netlify live deployment updated to index-dO3smCJJ.js!")
            break
    except Exception as e:
        print("Exception:", e)
    time.sleep(5)
