import numpy as np
from PIL import Image
from typing import Dict, Any, List, Tuple

def analyze_frequency_domain(image: Image.Image) -> Dict[str, Any]:
    """
    Computes 2D Fourier Transform (FFT) analysis of the grayscale image.
    Generative AI models (diffusion, GANs) often display high-frequency grid artifacts
    or unnatural high-frequency power spectrum distribution.
    """
    gray = np.array(image.convert("L"), dtype=np.float32)
    h, w = gray.shape

    if h < 32 or w < 32:
        return {"frequencyScore": 50, "highFreqRatio": 0.5, "spectralAnomaly": "Insufficient resolution"}

    # 2D Fast Fourier Transform & Shift zero frequency component to center
    f_transform = np.fft.fft2(gray)
    f_shift = np.fft.fftshift(f_transform)
    magnitude_spectrum = 20 * np.log(np.abs(f_shift) + 1e-6)

    # Compute high frequency vs low frequency energy ratio
    cy, cx = h // 2, w // 2
    r = min(h, w) // 4

    y, x = np.ogrid[:h, :w]
    mask_low = (y - cy)**2 + (x - cx)**2 <= r**2

    total_energy = np.sum(np.abs(f_shift))
    low_energy = np.sum(np.abs(f_shift)[mask_low])
    high_energy = total_energy - low_energy

    high_freq_ratio = float(high_energy / max(1e-6, total_energy))

    # AI synthetic models frequently exhibit excessive or artificially suppressed high-frequency energy
    # Normal natural photos typically have high_freq_ratio between 0.35 and 0.65
    if high_freq_ratio > 0.72 or high_freq_ratio < 0.25:
        freq_score = min(98, int(70 + abs(high_freq_ratio - 0.5) * 60))
        anomaly_desc = "Unnatural high-frequency spectral distribution detected"
    else:
        freq_score = max(10, int(20 + abs(high_freq_ratio - 0.5) * 40))
        anomaly_desc = "Natural power spectrum decay consistent with optical lens capture"

    return {
        "frequencyScore": freq_score,
        "highFreqRatio": round(high_freq_ratio, 4),
        "spectralAnomaly": anomaly_desc
    }

def analyze_spatial_noise(image: Image.Image) -> Dict[str, Any]:
    """
    Evaluates spatial noise variance and Laplacian high-pass residual.
    Camera sensors exhibit natural Poisson-Gaussian noise patterns; synthetic AI images
    frequently display unnatural local smoothness or uniform synthetic noise.
    """
    gray = np.array(image.convert("L"), dtype=np.float32)
    h, w = gray.shape

    if h < 32 or w < 32:
        return {"noiseScore": 50, "noiseVariance": 0.0, "noisePattern": "Low resolution"}

    # Simple 3x3 Laplacian operator for high-pass noise extraction
    kernel = np.array([[0, 1, 0], [1, -4, 1], [0, 1, 0]], dtype=np.float32)
    
    try:
        # Pure NumPy 3x3 Laplacian high-pass filter (zero external library dependency)
        laplacian = gray[1:-1, 2:] + gray[1:-1, :-2] + gray[2:, 1:-1] + gray[:-2, 1:-1] - 4.0 * gray[1:-1, 1:-1]
        variance = float(np.var(laplacian))
    except Exception:
        diff = np.diff(gray, axis=1)
        variance = float(np.var(diff))

    # Natural camera photos typically have noise variance > 120.0
    # Synthetic diffusion outputs often have smoothed noise variance < 40.0 or exaggerated > 500.0
    if variance < 35.0 or variance > 450.0:
        noise_score = min(95, int(65 + (35.0 - min(35.0, variance)) * 0.8))
        pattern_desc = "Synthetic smoothness or non-sensor noise variance detected"
    else:
        noise_score = max(12, int(25 + abs(variance - 180.0) * 0.1))
        pattern_desc = "Sensor noise variance consistent with physical camera sensor"

    return {
        "noiseScore": noise_score,
        "noiseVariance": round(variance, 2),
        "noisePattern": pattern_desc
    }

def analyze_color_histograms(image: Image.Image) -> Dict[str, Any]:
    """
    Analyzes color channel correlation and quantization smoothness.
    Generative models sometimes display unnatural color channel correlations.
    """
    img_arr = np.array(image.convert("RGB"), dtype=np.float32)
    r, g, b = img_arr[:, :, 0], img_arr[:, :, 1], img_arr[:, :, 2]

    if r.size < 16 or np.std(r) == 0 or np.std(g) == 0 or np.std(b) == 0:
        return {
            "colorScore": 50,
            "channelCorrelation": 0.5,
            "colorAnomaly": "Uniform color distribution"
        }

    # Calculate channel correlations
    corr_rg = float(np.corrcoef(r.flatten(), g.flatten())[0, 1])
    corr_rb = float(np.corrcoef(r.flatten(), b.flatten())[0, 1])
    corr_gb = float(np.corrcoef(g.flatten(), b.flatten())[0, 1])
    mean_corr = (corr_rg + corr_rb + corr_gb) / 3.0
    if np.isnan(mean_corr):
        mean_corr = 0.5

    # Extremely high correlation (>0.985) or unnatural low correlation (<0.60) can signal synthesis
    if mean_corr > 0.985 or mean_corr < 0.60:
        color_score = min(92, int(60 + abs(mean_corr - 0.85) * 150))
        color_desc = "Color channel distribution exhibits synthetic correlation signature"
    else:
        color_score = max(15, int(20 + abs(mean_corr - 0.85) * 50))
        color_desc = "Natural color channel correlation consistent with optical light spectrum"

    return {
        "colorScore": color_score,
        "channelCorrelation": round(mean_corr, 4),
        "colorAnomaly": color_desc
    }

def extract_forensic_signals(image: Image.Image) -> Tuple[List[Dict[str, Any]], float]:
    """
    Extracts all physical/spectral forensic signals and returns:
    (indicators_list, aggregate_forensic_score_normalized)
    """
    freq_data = analyze_frequency_domain(image)
    noise_data = analyze_spatial_noise(image)
    color_data = analyze_color_histograms(image)

    indicators = [
        {
            "name": "Spectral Frequency Artifacts",
            "score": freq_data["frequencyScore"],
            "description": freq_data["spectralAnomaly"]
        },
        {
            "name": "Sensor Noise Consistency",
            "score": noise_data["noiseScore"],
            "description": noise_data["noisePattern"]
        },
        {
            "name": "Color Distribution Divergence",
            "score": color_data["colorScore"],
            "description": color_data["colorAnomaly"]
        }
    ]

    weights = [0.4, 0.35, 0.25]
    avg_score = (
        freq_data["frequencyScore"] * weights[0] +
        noise_data["noiseScore"] * weights[1] +
        color_data["colorScore"] * weights[2]
    ) / 100.0

    return indicators, float(avg_score)
