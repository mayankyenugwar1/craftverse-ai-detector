import requests

base = "https://craftverse-backend.onrender.com"

endpoints = [
    ("/", "GET"),
    ("/health", "GET"),
    ("/api", "GET"),
    ("/api/health", "GET"),
    ("/docs", "GET"),
    ("/api/docs", "GET"),
    ("/openapi.json", "GET"),
    ("/api/openapi.json", "GET"),
    ("/analyze", "POST"),
    ("/api/analyze", "POST"),
    ("/api/v1/analyze", "POST"),
    ("/detect", "POST"),
    ("/api/detect", "POST"),
    ("/upload", "POST"),
    ("/api/upload", "POST"),
]

for ep, method in endpoints:
    url = base + ep
    try:
        if method == "POST":
            files = {"file": ("test.png", b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82", "image/png")}
            r = requests.post(url, files=files, timeout=8)
        else:
            r = requests.get(url, timeout=8)
        print(f"[{r.status_code}] {method} {url} | Body: {r.text[:120]}")
    except Exception as e:
        print(f"[ERR] {method} {url} -> {e}")
