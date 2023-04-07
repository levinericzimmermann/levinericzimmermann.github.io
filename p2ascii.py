import os

from PIL import Image
from PIL import ImageEnhance
from PIL import UnidentifiedImageError

from ascii_magic import AsciiArt


def img2asciifile(img_path, ascii_path=None):
    img = Image.open(img_path)

    bri = ImageEnhance.Brightness(img)
    # img = bri.enhance(3)
    img = bri.enhance(2)

    sharp = ImageEnhance.Sharpness(img)
    img = sharp.enhance(3)

    contr = ImageEnhance.Contrast(img)
    img = contr.enhance(-6)

    a = AsciiArt.from_pillow_image(img)
    kwargs = dict(columns=70, monochrome=1)
    if ascii_path is None:
        return a.to_terminal(**kwargs)
    a.to_file(ascii_path, **kwargs)


def replace_tea_img_with_ascii():
    basepath = "assets"
    for p in os.listdir(basepath):
        if not p[:3] == "tea":
            continue
        img_path = f"{basepath}/{p}"
        asciipath = f"{basepath}/{p[:-5]}"
        try:
            img2asciifile(img_path, asciipath)
        except UnidentifiedImageError:
            continue


if __name__ == "__main__":
    replace_tea_img_with_ascii()
