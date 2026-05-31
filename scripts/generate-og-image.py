#!/usr/bin/env python3
"""Generate public/og-image.png (1200x630) for social sharing."""

from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    raise SystemExit("Install Pillow: pip3 install Pillow")

ROOT = Path(__file__).resolve().parents[1]
LOGO_PATH = ROOT / "src" / "assets" / "poonji-logo-new.png"
OUT_PATH = ROOT / "public" / "og-image.png"

W, H = 1200, 630
BG = (10, 10, 15)
PRIMARY = (34, 95, 68)  # ~hsl(155 55% 30%)
ACCENT = (198, 162, 58)  # ~hsl(42 55% 55%)
TEXT = (232, 236, 233)
TEXT_MUTED = (138, 149, 144)


def load_font(size, bold=False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Georgia.ttf",
        "/System/Library/Fonts/Supplemental/Georgia Bold.ttf" if bold else "",
        "/Library/Fonts/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for path in candidates:
        if path and Path(path).exists():
            try:
                return ImageFont.truetype(path, size)
            except OSError:
                continue
    return ImageFont.load_default()


def draw_grid(draw: ImageDraw.ImageDraw) -> None:
    grid_color = (PRIMARY[0], PRIMARY[1], PRIMARY[2], 18)
    for x in range(0, W, 48):
        draw.line([(x, 0), (x, H)], fill=grid_color, width=1)
    for y in range(0, H, 48):
        draw.line([(0, y), (W, y)], fill=grid_color, width=1)


def main() -> None:
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img, "RGBA")
    draw_grid(draw)

    # Accent glow line
    draw.line([(80, H - 120), (W - 80, H - 120)], fill=(*PRIMARY, 120), width=2)
    draw.line([(80, 88), (420, 88)], fill=(*ACCENT, 180), width=3)

    # Logo
    logo = Image.open(LOGO_PATH).convert("RGBA")
    logo.thumbnail((120, 120), Image.Resampling.LANCZOS)
    img.paste(logo, (80, 72), logo)

    # Wordmark
    draw.text((220, 98), "poonji.ai", fill=TEXT_MUTED, font=load_font(28))

    # Headline
    title_font = load_font(58, bold=True)
    headline = "Prediction Markets.\nInstitutional Grade."
    draw.multiline_text((80, 220), headline, fill=TEXT, font=title_font, spacing=12)

    # Subtext / tagline
    body_font = load_font(26)
    draw.text(
        (80, 400),
        "Principal-protected structured bonds for institutional mandates.",
        fill=TEXT_MUTED,
        font=body_font,
    )

    # Monospace footer label
    mono_font = load_font(22)
    draw.text((80, H - 80), "EVENT-LINKED CREDIT INFRASTRUCTURE", fill=(*ACCENT, 255), font=mono_font)

    # Border frame
    draw.rectangle([(40, 40), (W - 40, H - 40)], outline=(*PRIMARY, 80), width=1)

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT_PATH, "PNG", optimize=True)
    print(f"Wrote {OUT_PATH} ({OUT_PATH.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
