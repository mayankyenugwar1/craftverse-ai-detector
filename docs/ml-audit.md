# CraftVerse AI Detector — Machine Learning Pipeline Audit & Architecture Plan

**Document Version**: `1.0.0`  
**Date**: August 19, 2026  
**Module**: `CraftVerse AI Security & Digital Forensics`  

---

## Executive Summary

CraftVerse AI Detector was previously reliant on external third-party API providers (Sightengine, Hive) or static demo rules. While suitable for basic prototyping, external API integration suffers from latency, strict quota limits, lack of explainable raw logits, uncalibrated confidence output, and potential privacy concerns.

This document outlines the complete machine learning architecture migration for CraftVerse to run an **in-house, real-time, calibrated deep-learning vision transformer (ViT) ensemble pipeline** natively within FastAPI.

---

## 1. System Audit of Previous Implementation

| Architectural Component | Previous Implementation | Technical Limitations & Vulnerabilities |
| :--- | :--- | :--- |
| **Detection Backend** | External SaaS API calls (`Sightengine` / `Hive`) or static Mock fixture | Non-deterministic latency (2s–5s), API rate limits, lack of offline reliability, zero control over underlying weights. |
| **Preprocessing Pipeline** | Minimal image validation (`PIL.Image.open`), basic size check | Loss of fine-grained spatial and frequency artifacts due to unstandardized resizing; no multi-crop evaluation. |
| **Scoring & Classification** | Raw threshold mapping on vendor scores | Vendor probabilities are uncalibrated and prone to overconfident false positives (e.g. 92% AI on real high-contrast photos). |
| **Uncertainty Region** | Rigid binary cutoffs (AI vs Authentic) | Lacks a mathematically sound uncertainty zone; forces binary decisions even when neural signals disagree. |
| **Forensic Signal Fusion** | Basic indicator extraction from SaaS JSON | No direct mathematical evaluation of high-frequency spectral energy (FFT) or spatial noise distributions. |
| **LLM Explanation Layer** | Prompting Claude with raw SaaS scores | Risk of hallucinating non-existent visual features if LLM is not strictly grounded in empirical detector signals. |

---

## 2. Proposed Replacement Architecture

CraftVerse is migrating to a **Hybrid ViT-Forensic Ensemble Architecture**:

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                         Uploaded Media File                            │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                      Phase 3: Safe Preprocessing                       │
 │    • RGB conversion & aspect-ratio preservation                       │
 │    • Multi-crop extraction (Full, Center Crop, High-Res Patch)         │
 │    • EXIF & Image Metadata extraction                                 │
 └─────────────────┬──────────────────────────────────┬───────────────────┘
                   │                                  │
                   ▼                                  ▼
 ┌────────────────────────────────────┐ ┌─────────────────────────────────┐
 │   Phase 2 & 4: Deep Learning ViT   │ │   Phase 14: Spectral Forensics  │
 │  Vision Transformer Classifier     │ │  • 2D Fourier Transform (FFT)   │
 │  (capcheck / ViT fine-tuned)       │ │  • Spatial Noise Variance       │
 │  Multi-crop prediction & agreement │ │  • Color Histogram Divergence   │
 └─────────────────┬──────────────────┘ └────────────────┬────────────────┘
                   │                                     │
                   └──────────────────┬──────────────────┘
                                      │
                                      ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                  Phase 11 & 13: Ensemble & Calibration                 │
 │    • Temperature & Platt Scaling Probability Calibration               │
 │    • Detector Signal Agreement Check                                   │
 │    • Uncertainty Threshold Evaluation (Likely AI / Real / Uncertain)   │
 └────────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                    Phase 17: Grounded LLM Explanation                  │
 │    • Claude explanation strictly bound to empirical ensemble signals   │
 │    • Zero hallucinated visual claims                                  │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Requirements & Key Design Decisions

### 3.1 Pretrained Deep Learning Backbone
- Primary Backbone: `capcheck/ai-human-generated-image-detection` (ViT-based classifier fine-tuned on diverse generative AI datasets) with fallback support for `umm-maybe/AI-image-detector`.
- Single-instance memory loading at FastAPI startup (`app.on_event("startup")`) to ensure sub-500ms inference without re-instantiating heavy models per HTTP request.
- Automatic device selection: GPU (`cuda`) if available, graceful CPU fallback.

### 3.2 Multi-Crop Analysis
- Rather than resizing an image down to 224x224 and destroying microscopic diffusion artifacts, CraftVerse evaluates:
  1. Full image (resized while preserving macro layout).
  2. Center crop (high-density region).
  3. High-resolution patch (preserving native sensor or synthesis frequency).
- Scores are aggregated with agreement variance checks. If crops disagree significantly (standard deviation $> 0.25$), the system flags the result as `UNCERTAIN`.

### 3.3 Probability Calibration (Temperature Scaling)
- Raw neural network softmax outputs are uncalibrated and tend toward overconfidence.
- We implement Platt & Temperature Scaling ($P_{calibrated} = \sigma(z / T)$) where $T$ is tuned on validation data.
- Output labels:
  - `Probability AI` $< 35\%$: **LIKELY REAL / HUMAN-CREATED**
  - `Probability AI` $> 65\%$: **LIKELY AI-GENERATED**
  - $35\% \le \text{Probability AI} \le 65\%$: **UNCERTAIN**

### 3.4 Grounded Forensic Signal Integration
- Fourier Transform (FFT 2D) High-Frequency Energy Ratio: Generative models frequently display grid-like spectral artifacts or abnormal high-frequency falloff.
- Noise Residual Variance: Real camera sensors exhibit natural Poisson-Gaussian noise distributions; synthetic images display smoothed or uniform noise textures.
- Color Distribution Artifacts: Color histogram analysis detecting synthetic quantization.

---

## 4. Migration Plan

1. **Phase 1**: Audit existing provider architecture (completed in `docs/ml-audit.md`).
2. **Phase 2–4**: Implement `backend/app/ml/` directory containing `preprocessing.py`, `calibration.py`, `forensics.py`, `detector.py`, `ensemble.py`.
3. **Phase 5–10**: Implement dataset management, augmentation, evaluation metrics, and training pipeline (`backend/app/ml/evaluation.py`, `backend/app/ml/training.py`). Generate `docs/ml-evaluation.md`.
4. **Phase 11–15**: Integrate calibration, uncertainty bounds, and structured JSON output.
5. **Phase 16–17**: Update FastAPI routes (`/api/analyze`), health checks (`/api/health`), and ground Claude service explanations in empirical ML signals.
6. **Phase 18–25**: Implement user feedback endpoint (`/api/feedback`), model versioning (`craftverse-detector-v1`), and complete test suite verification.

---

**Approved By**: CraftVerse Machine Learning Engineering Team  
**Status**: In Progress  
