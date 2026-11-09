"""Make a clean, transparent cut-out of a portrait for the website.

    python scripts/make-portrait-cutout.py <photo.jpg> <output.png> [--max-width 1600] [--fade 0.16] [--sharpen 0.45]

Used for:
    hero   "Formal picture in suit.jpg" → src/assets/portrait-cutout.png  --max-width 1600 --fade 0.16 --no-enhance
    about  "890187627_…_n.jpg"          → src/assets/about-portrait.png    --max-width 1100 --fade 0.08

Steps:
  1. Background removal with an AI matting model (rembg, BiRefNet-portrait;
     falls back to IS-Net if that model cannot run). Hair gets a soft, precise
     edge instead of a hard cut.
  2. Edge colour clean-up: removes the old background's tint from
     semi-transparent hair pixels (pymatting foreground estimation), so no
     white/green halo shows on dark or orange pages.
  3. Optional gentle enhancement: mild local contrast (CLAHE on lightness) and
     an unsharp mask. --no-enhance skips it (and never upscales), leaving the
     photo's own colours and detail untouched.
  4. Crop to the person, fade the bottom edge (where the photo is cut off), and
     save a high-quality PNG. Astro converts it to WebP at build time.

Requirements (kept out of the project's npm dependencies — use a throwaway
virtual environment):
    python -m venv .venv-photo
    .venv-photo\\Scripts\\pip install "rembg[cpu]" opencv-python
    .venv-photo\\Scripts\\python scripts/make-portrait-cutout.py "Formal picture in suit.jpg" src/assets/portrait-cutout.png
The first run downloads the model (~900 MB for BiRefNet-portrait) into ~/.u2net.
"""

import argparse
import sys

import cv2
import numpy as np


def matte(path: str) -> np.ndarray:
    """Alpha in [0, 1] from an AI matting model."""
    from PIL import Image
    from rembg import new_session, remove

    image = Image.open(path).convert("RGB")
    for model in ("birefnet-portrait", "isnet-general-use"):
        try:
            mask = remove(image, session=new_session(model), only_mask=True)
            print(f"  matte: {model}")
            return np.asarray(mask, np.float32) / 255.0
        except Exception as exc:  # e.g. not enough memory for BiRefNet
            print(f"  matte: {model} failed ({type(exc).__name__}); trying the next model")
    sys.exit("Background removal failed with every model.")


def clean_alpha(alpha: np.ndarray) -> np.ndarray:
    """Drop faint specks far from the person; keep soft hair edges."""
    alpha = np.where(alpha < 0.03, 0.0, alpha)
    solid = (alpha > 0.5).astype(np.uint8)
    count, labels, stats, _ = cv2.connectedComponentsWithStats(solid, connectivity=8)
    if count > 1:
        keep = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
        body = (labels == keep).astype(np.uint8)
        near = cv2.dilate(body, np.ones((3, 3), np.uint8), iterations=40)
        alpha = alpha * near
    return np.clip(alpha, 0.0, 1.0)


def foreground_colours(rgb: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    """Estimate true foreground colours where alpha is partial."""
    from pymatting import estimate_foreground_ml

    fg = estimate_foreground_ml(rgb.astype(np.float64) / 255.0, alpha.astype(np.float64))
    fg = (np.clip(fg, 0, 1) * 255).astype(np.float32)
    # Only replace edge pixels; keep the original detail everywhere else.
    edge = ((alpha > 0.0) & (alpha < 0.98))[..., None]
    return np.where(edge, fg, rgb)


def enhance(rgb: np.ndarray, sharpen: float) -> np.ndarray:
    lab = cv2.cvtColor(rgb.astype(np.uint8), cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)
    l = cv2.createCLAHE(clipLimit=1.4, tileGridSize=(8, 8)).apply(l)
    out = cv2.cvtColor(cv2.merge([l, a, b]), cv2.COLOR_LAB2RGB).astype(np.float32)
    # Gentle unsharp mask.
    blur = cv2.GaussianBlur(out, (0, 0), 1.4)
    out = np.clip(out + sharpen * (out - blur), 0, 255)
    return out


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("src")
    p.add_argument("dst")
    p.add_argument("--max-width", type=int, default=1600)
    p.add_argument("--sharpen", type=float, default=0.45, help="unsharp-mask amount (lower for already-enhanced photos)")
    p.add_argument("--fade", type=float, default=0.16, help="bottom fraction to fade out (0 = none)")
    p.add_argument("--no-enhance", action="store_true", help="no contrast/sharpening and no upscaling: background removal only")
    args = p.parse_args()

    bgr = cv2.imread(args.src, cv2.IMREAD_COLOR)
    if bgr is None:
        sys.exit(f"Cannot read {args.src}")
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB).astype(np.float32)
    print(f"{args.src}: {rgb.shape[1]}×{rgb.shape[0]}")

    alpha = clean_alpha(matte(args.src))
    rgb = foreground_colours(rgb, alpha)
    if not args.no_enhance:
        rgb = enhance(rgb, args.sharpen)

    # Crop to the person (small margin), then fade the bottom edge.
    ys, xs = np.where(alpha > 0.02)
    pad = 12
    top, bottom = max(0, ys.min() - pad), alpha.shape[0]
    left, right = max(0, xs.min() - pad), min(alpha.shape[1], xs.max() + pad + 1)
    rgb, alpha = rgb[top:bottom, left:right], alpha[top:bottom, left:right]
    if args.fade > 0:
        h = alpha.shape[0]
        n = int(h * args.fade)
        ramp = np.ones(h, np.float32)
        ramp[h - n :] = np.linspace(1.0, 0.0, n) ** 1.6
        alpha = alpha * ramp[:, None]

    # Resize (high-quality) to the target width.
    w = rgb.shape[1]
    scale = args.max_width / w
    if args.no_enhance:
        scale = min(scale, 1.0)
    interp = cv2.INTER_AREA if scale < 1 else cv2.INTER_LANCZOS4
    if abs(scale - 1) > 0.01:
        size = (round(w * scale), round(rgb.shape[0] * scale))
        rgb = cv2.resize(rgb, size, interpolation=interp)
        alpha = cv2.resize(alpha, size, interpolation=interp)

    rgba = np.dstack([np.clip(rgb, 0, 255), np.clip(alpha, 0, 1) * 255]).round().astype(np.uint8)
    cv2.imwrite(args.dst, cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA), [cv2.IMWRITE_PNG_COMPRESSION, 9])
    print(f"OK: wrote {args.dst} ({rgba.shape[1]}×{rgba.shape[0]})")


if __name__ == "__main__":
    main()
