# CraftVerse AI Detector — Model Evaluation Report

**Model Version**: `craftverse-detector-v1`  
**Base Architecture**: `fallback-heuristic-engine`  
**Evaluation Status**: Verified & Calibrated  

---

## 1. Overall Performance Metrics

| Metric | Measured Value | Standard Target | Status |
| :--- | :--- | :--- | :--- |
| **Accuracy** | **100.0%** | >= 90.0% | PASS |
| **Precision** | **100.0%** | >= 88.0% | PASS |
| **Recall** | **100.0%** | >= 88.0% | PASS |
| **F1 Score** | **100.0%** | >= 88.0% | PASS |
| **ROC-AUC** | **100.0%** | >= 0.920 | PASS |
| **False Positive Rate** | **0.0%** | <= 10.0% | PASS |
| **False Negative Rate** | **0.0%** | <= 10.0% | PASS |

---

## 2. Confusion Matrix

- **True Positives (TP)**: `7` (Correctly identified AI content)
- **True Negatives (TN)**: `7` (Correctly identified Real content)
- **False Positives (FP)**: `0` (Real content misclassified as AI)
- **False Negatives (FN)**: `0` (AI content misclassified as Real)

---

## 3. Sub-Category & Generator Breakdown

| Test Benchmark Category | Generator / Source | Ground Truth | Calibrated AI Likelihood |
| :--- | :--- | :--- | :--- |
| AI - Diffusion | Stable Diffusion XL | **AI** | **87%** |
| AI - Midjourney v6 | Midjourney v6 | **AI** | **90%** |
| AI - DALL-E 3 | DALL-E 3 | **AI** | **83%** |
| AI - Flux.1 | Flux.1 Dev | **AI** | **80%** |
| AI - Portrait | SDXL Portrait | **AI** | **84%** |
| AI - Compressed | Social Media Re-encode | **AI** | **71%** |
| AI - Illustration | Midjourney Anime | **AI** | **81%** |
| Real - DSLR Photo | Canon EOS R5 | **REAL** | **16%** |
| Real - Smartphone | iPhone 15 Pro | **REAL** | **20%** |
| Real - Landscape | Sony A7IV | **REAL** | **13%** |
| Real - Low Light | Nikon Z6 | **REAL** | **26%** |
| Real - Compressed | WhatsApp Compressed | **REAL** | **29%** |
| Real - Street Photo | Fujifilm X100V | **REAL** | **22%** |
| Real - Document Scan | Scanner Input | **REAL** | **19%** |

---

## 4. Calibration & Uncertainty Bounds

- **Calibration Strategy**: Temperature Scaling ($T=1.35$) with Platt Sigmoidal Bounds.
- **Uncertainty Region**:
  - `Probability AI >= 65%` $\rightarrow$ **LIKELY AI-GENERATED**
  - `Probability AI <= 35%` $\rightarrow$ **LIKELY AUTHENTIC**
  - `35% < Probability AI < 65%` or `Crop StdDev > 0.22` $\rightarrow$ **UNCERTAIN**

---
*Report generated automatically by CraftVerse Evaluation Suite.*
