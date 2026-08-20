import requests

urls = [
    "https://craftverse-ai-detector-backend.onrender.com/health",
    "https://craftverse-ai-detector-backend.onrender.com/api/health",
    "https://craftverse-ai-detector-backend.onrender.com/api/analyze",
    "https://craftverse-backend.onrender.com/health",
    "https://craftverse-backend.onrender.com/api/health",
    "https://craftverse-backend.onrender.com/api/analyze",
]

for url in urls:
    try:
        if "analyze" in url:
            files = {"file": ("test.png", b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82", "image/png")}
            r = requests.post(url, files=files, timeout=10)
        else:
            r = requests.get(url, timeout=10)
        srv = r.headers.get("Server", "")
        rr = r.headers.get("x-render-routing", "")
        print(f"[{r.status_code}] {url} | Server: {srv} | Render-Routing: {rr} | Body: {r.text[:80]}")
    except Exception as e:
        print(f"[ERR] {url} -> Exception: {e}")
