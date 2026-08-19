import os
import io
import logging
from typing import Dict, Any, List, Tuple
from PIL import Image, ImageOps, ImageFile, ExifTags

ImageFile.LOAD_TRUNCATED_IMAGES = True

logger = logging.getLogger("craftverse.ml.preprocessing")

def extract_image_metadata(image: Image.Image, file_path: str) -> Dict[str, Any]:
    """
    Extract metadata from image file (dimensions, format, EXIF, color mode).
    Metadata is used strictly as supporting evidence, never as primary classification.
    """
    file_size = os.path.getsize(file_path) if os.path.exists(file_path) else 0
    width, height = image.size
    
    exif_present = False
    exif_data = {}
    try:
        raw_exif = image._getexif()
        if raw_exif:
            exif_present = True
            for tag_id, val in raw_exif.items():
                tag_name = ExifTags.TAGS.get(tag_id, str(tag_id))
                if isinstance(val, (int, float, str)):
                    exif_data[tag_name] = str(val)[:50]
    except Exception:
        exif_present = False

    icc_profile = bool(image.info.get("icc_profile"))

    return {
        "width": width,
        "height": height,
        "aspectRatio": round(width / max(1, height), 2),
        "format": image.format or os.path.splitext(file_path)[1].lstrip(".").upper(),
        "mode": image.mode,
        "fileSize": file_size,
        "exifPresent": exif_present,
        "exifSample": dict(list(exif_data.items())[:5]),
        "hasIccProfile": icc_profile,
    }

def load_and_preprocess_image(file_path: str) -> Tuple[Image.Image, Dict[str, Any]]:
    """
    Safely load an image, auto-orient based on EXIF, convert to RGB mode,
    and extract non-destructive metadata.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Image file not found: {file_path}")

    try:
        with Image.open(file_path) as raw_img:
            # Auto rotate based on EXIF orientation if available
            img = ImageOps.exif_transpose(raw_img)
            img = img.convert("RGB")
            metadata = extract_image_metadata(img, file_path)
            return img.copy(), metadata
    except Exception as e:
        logger.error(f"Failed to decode image at {file_path}: {e}")
        raise ValueError(f"Corrupted or unreadable image file: {e}")

def generate_multi_crops(image: Image.Image) -> List[Tuple[str, Image.Image]]:
    """
    Generate deterministic crops for multi-crop spatial evaluation:
    1. 'full': Full image resized with preserved aspect ratio
    2. 'center_crop': 80% center region crop
    3. 'highres_patch': High-resolution central patch
    """
    width, height = image.size
    crops = []

    # 1. Full Image
    crops.append(("full", image))

    # 2. 80% Center Crop
    crop_w = int(width * 0.8)
    crop_h = int(height * 0.8)
    left = (width - crop_w) // 2
    top = (height - crop_h) // 2
    center_img = image.crop((left, top, left + crop_w, top + crop_h))
    crops.append(("center_crop", center_img))

    # 3. High-res Patch (50% central region or minimum 224x224)
    patch_w = max(224, min(width, int(width * 0.5)))
    patch_h = max(224, min(height, int(height * 0.5)))
    p_left = (width - patch_w) // 2
    p_top = (height - patch_h) // 2
    patch_img = image.crop((p_left, p_top, p_left + patch_w, p_top + patch_h))
    crops.append(("highres_patch", patch_img))

    return crops
