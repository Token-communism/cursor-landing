from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"

OG_SIZE = (1200, 630)
PAGE_BG = (20, 20, 20)  # #141414
BRAND_GREEN = (0, 236, 126)
FG = (255, 255, 255, 230)
MUTED = (255, 255, 255, 179)


def _font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        Path(r"C:\Windows\Fonts\msyhbd.ttc") if bold else Path(r"C:\Windows\Fonts\msyh.ttc"),
        Path(r"C:\Windows\Fonts\msyh.ttc"),
        Path("/System/Library/Fonts/PingFang.ttc"),
        Path("/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc"),
    ]
    for path in candidates:
        if path.exists():
            try:
                return ImageFont.truetype(str(path), size=size)
            except OSError:
                continue
    return ImageFont.load_default()


def _radial_glow(
    size: tuple[int, int],
    box: tuple[int, int, int, int],
    color: tuple[int, int, int],
    peak: int,
) -> Image.Image:
    overlay = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.ellipse(box, fill=(*color, peak))
    return overlay.filter(ImageFilter.GaussianBlur(90))


def make_og() -> None:
    PUBLIC.mkdir(parents=True, exist_ok=True)
    canvas = Image.new("RGBA", OG_SIZE, (*PAGE_BG, 255))
    glow = _radial_glow(OG_SIZE, (180, -220, 1020, 420), BRAND_GREEN, 72)
    canvas = Image.alpha_composite(canvas, glow)

    logo_path = PUBLIC / "logo.png"
    if logo_path.exists():
        logo = Image.open(logo_path).convert("RGBA")
        logo = logo.resize((168, 168), Image.Resampling.LANCZOS)
        canvas.paste(logo, (108, 231), logo)

    draw = ImageDraw.Draw(canvas)
    title_font = _font(72, bold=True)
    sub_font = _font(28)
    draw.text((312, 228), "Cursor 精灵", font=title_font, fill=FG)
    draw.text((312, 332), "一把密钥，一键启动一份已登录的官方 Cursor", font=sub_font, fill=MUTED)

    rgb = canvas.convert("RGB")
    rgb.save(PUBLIC / "og.png", "PNG", optimize=True)
    rgb.save(PUBLIC / "og.webp", "WEBP", quality=90)


def make_logo_webp() -> None:
    src = PUBLIC / "logo.png"
    if not src.exists():
        return
    image = Image.open(src).convert("RGBA")
    image.save(PUBLIC / "logo.webp", "WEBP", quality=90)


def make_placeholder_screenshot(note: str) -> None:
    width, height = 820, 558
    canvas = Image.new("RGBA", (width, height), (*PAGE_BG, 255))
    glow = _radial_glow((width, height), (80, -180, 740, 300), BRAND_GREEN, 60)
    canvas = Image.alpha_composite(canvas, glow)
    draw = ImageDraw.Draw(canvas)
    title_font = _font(36, bold=True)
    body_font = _font(20)
    draw.text((48, 200), "Cursor 精灵", font=title_font, fill=FG)
    draw.text((48, 260), note, font=body_font, fill=MUTED)
    rgb = canvas.convert("RGB")
    rgb.save(PUBLIC / "demo-screenshot.png", "PNG", optimize=True)
    rgb.save(PUBLIC / "demo-screenshot.webp", "WEBP", quality=88)


def convert_screenshot() -> None:
    src = PUBLIC / "demo-screenshot.png"
    if not src.exists():
        return
    image = Image.open(src).convert("RGB")
    image = image.resize((820, 558), Image.Resampling.LANCZOS)
    image.save(PUBLIC / "demo-screenshot.webp", "WEBP", quality=88)


if __name__ == "__main__":
    make_logo_webp()
    make_og()
    convert_screenshot()
    print("wrote", PUBLIC / "og.png")
    print("wrote", PUBLIC / "og.webp")
    print("wrote", PUBLIC / "logo.webp")
    if (PUBLIC / "demo-screenshot.webp").exists():
        print("wrote", PUBLIC / "demo-screenshot.webp")
