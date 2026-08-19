import os
import sys
import json
import time
import requests

BASE_URL = os.environ.get("TEST_API_URL", "http://localhost:8000")

def print_header(title):
    print("\n" + "=" * 65)
    print(f" TEST SUITE: {title}")
    print("=" * 65)

def test_health_endpoint():
    print_header("1. Health Endpoint (GET /api/health)")
    url = f"{BASE_URL}/api/health"
    resp = requests.get(url, timeout=5)
    print(f"Status Code: {resp.status_code}")
    data = resp.json()
    print(f"Response: {json.dumps(data, indent=2)}")
    assert resp.status_code == 200, "Health check failed"
    assert data.get("status") in ["ok", "degraded"], "Invalid health status"
    print("  [OK] Health check test PASSED.")

def test_valid_image_analysis():
    print_header("2. Valid Image Analysis (POST /api/analyze)")
    url = f"{BASE_URL}/api/analyze"
    
    # 1x1 PNG pixel
    png_bytes = bytes([137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,1,0,0,0,1,8,2,0,0,0,144,119,83,222,0,0,0,12,73,68,65,84,8,215,99,248,207,192,0,0,0,3,0,1,54,174,206,90,0,0,0,0,73,69,78,68,174,66,96,130])
    files = {'file': ('valid_pixel.png', png_bytes, 'image/png')}
    
    resp = requests.post(url, files=files, timeout=15)
    print(f"Status Code: {resp.status_code}")
    data = resp.json()
    print(f"Response Verdict: {data.get('data', {}).get('verdict')} | AI Prob: {data.get('data', {}).get('aiProbability')}%")
    assert resp.status_code == 200, f"Analysis failed: {resp.text}"
    assert data.get("success") == True, "Response success field is False"
    assert "verdict" in data.get("data", {}), "Missing verdict in analysis data"
    print("  [OK] Valid image analysis test PASSED.")

def test_corrupted_file_handling():
    print_header("3. Corrupted Image Handling (POST /api/analyze)")
    url = f"{BASE_URL}/api/analyze"
    
    # Corrupted header
    junk_bytes = b"CORRUPTED_HEADER_DATA_STREAM_1234567890"
    files = {'file': ('corrupted.png', junk_bytes, 'image/png')}
    
    resp = requests.post(url, files=files, timeout=10)
    print(f"Status Code: {resp.status_code}")
    data = resp.json()
    print(f"Structured Response: {json.dumps(data, indent=2)}")
    assert resp.status_code in [400, 422, 500], "Unexpected status code"
    assert data.get("success") == False, "Corrupted file should set success=False"
    assert "error" in data, "Corrupted file response missing error object"
    print("  [OK] Corrupted file handling test PASSED (Returned clean structured error).")

def test_unsupported_format_handling():
    print_header("4. Unsupported Format Handling (POST /api/analyze)")
    url = f"{BASE_URL}/api/analyze"
    
    files = {'file': ('test.exe', b"MZ_EXECUTABLE_BINARY_DATA", 'application/x-msdownload')}
    resp = requests.post(url, files=files, timeout=10)
    print(f"Status Code: {resp.status_code}")
    data = resp.json()
    print(f"Structured Response: {json.dumps(data, indent=2)}")
    assert resp.status_code == 415, f"Expected 415 for unsupported file, got {resp.status_code}"
    assert data.get("error", {}).get("code") == "UNSUPPORTED_FILE", "Incorrect error code"
    print("  [OK] Unsupported format handling test PASSED.")

def test_feedback_endpoint():
    print_header("5. User Feedback Endpoint (POST /api/feedback)")
    url = f"{BASE_URL}/api/feedback"
    payload = {
        "analysisId": "test-analysis-12345",
        "wasHelpful": True,
        "userSuggestedLabel": "real",
        "comments": "Automated verification test feedback"
    }
    resp = requests.post(url, json=payload, timeout=5)
    print(f"Status Code: {resp.status_code}")
    data = resp.json()
    print(f"Response: {json.dumps(data, indent=2)}")
    assert resp.status_code == 200, "Feedback submission failed"
    assert data.get("success") == True, "Feedback response success is False"
    print("  [OK] Feedback endpoint test PASSED.")

def run_all_tests():
    print("=" * 65)
    print(" CRAFTVERSE AI DETECTOR - AUTOMATED BACKEND HARDENING SUITE")
    print("=" * 65)
    try:
        test_health_endpoint()
        test_valid_image_analysis()
        test_corrupted_file_handling()
        test_unsupported_format_handling()
        test_feedback_endpoint()
        print("\n" + "=" * 65)
        print(" ALL HARDENING SUITE TESTS PASSED SUCCESSFULLY!")
        print("=" * 65)
    except AssertionError as ae:
        print(f"\n[FAIL] TEST FAILED: {ae}")
        sys.exit(1)
    except Exception as e:
        print(f"\n[FAIL] TEST SUITE EXCEPTION: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_all_tests()
