#!/usr/bin/env python3

"""
Image optimization helpers for Still Strava.

This module focuses on two use cases:

1. **Per-upload optimization**
   Used by the `/upload-image` endpoint to shrink individual photos
   before they are referenced by activities.

2. **Batch optimization & packing**
   A CLI-based helper that can walk a directory tree, compress supported
   image types, and optionally pack the result into a zip archive
   for archival or export.

The goal is to keep image storage lean on disk while playing nicely
with the existing client-side compression.
"""

from __future__ import annotations

import logging
import os
import sys
import zipfile
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Optional

from PIL import Image, UnidentifiedImageError


# -------------------------------------------------
# Configuration
# -------------------------------------------------

SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}


@dataclass
class OptimizeOptions:
    """Tunable knobs for image optimization."""

    quality: int = 85
    max_dim: Optional[int] = 1600


def setup_logging(level: int = logging.INFO) -> None:
    """Configure a simple root logger suitable for CLI or app use."""

    logging.basicConfig(
        level=level,
        format="%(asctime)s %(levelname)s %(message)s",
        datefmt="%H:%M:%S",
    )


def ensure_dir(path: Path) -> None:
    """Create directories recursively if they do not exist."""

    path.mkdir(parents=True, exist_ok=True)


def _resize_if_needed(img: Image.Image, max_dim: Optional[int]) -> Image.Image:
    """Resize image so that the longest side is at most `max_dim`."""

    if not max_dim:
        return img

    width, height = img.size
    longest = max(width, height)
    if longest <= max_dim:
        return img

    scale = max_dim / float(longest)
    new_size = (int(width * scale), int(height * scale))
    return img.resize(new_size, Image.LANCZOS)


def compress_image(
    src: Path,
    dst: Path,
    *,
    options: Optional[OptimizeOptions] = None,
) -> None:
    """
    Compress a single image from `src` into `dst`.

    - Converts non-RGB images to RGB.
    - Optionally resizes based on `max_dim`.
    - Saves as JPEG with configurable quality/optimization.
    """

    if options is None:
        options = OptimizeOptions()

    try:
        with Image.open(src) as img:
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            img = _resize_if_needed(img, options.max_dim)

            # Always save as JPEG for good compression; the extension of `dst`
            # determines how the URL will look but the content will be JPEG.
            ensure_dir(dst.parent)
            img.save(
                dst,
                "JPEG",
                quality=options.quality,
                optimize=True,
            )

        logging.info("Compressed %s → %s", src.name, dst.name)

    except UnidentifiedImageError:
        # If Pillow cannot open the file, copy it unchanged so we don't lose data
        ensure_dir(dst.parent)
        dst.write_bytes(src.read_bytes())
        logging.info("Copied unsupported %s", src.name)
    except Exception as exc:  # pragma: no cover - defensive logging
        logging.error("Failed to compress %s: %s", src, exc)


def optimize_image_file_in_place(
    path: str | Path,
    *,
    quality: int = 85,
    max_dim: Optional[int] = 1600,
) -> None:
    """
    Optimize an image file on disk, replacing it in place.

    Used by the Flask upload endpoint so that every stored upload
    is automatically compressed after it is written to disk.
    """

    src_path = Path(path)

    if not src_path.exists() or not src_path.is_file():
        logging.warning("optimize_image_file_in_place: %s does not exist", src_path)
        return

    ext = src_path.suffix.lower()
    if ext not in SUPPORTED_EXTENSIONS:
        # Respect non-image uploads by leaving them untouched
        logging.info(
            "optimize_image_file_in_place: %s has unsupported extension %s, skipping",
            src_path.name,
            ext,
        )
        return

    # We write to a temporary path and then move over the original
    temp_path = src_path.with_suffix(src_path.suffix + ".opt-tmp")

    options = OptimizeOptions(quality=quality, max_dim=max_dim)
    compress_image(src_path, temp_path, options=options)

    # Swap the optimized file into place
    try:
        os.replace(temp_path, src_path)
        logging.info("Optimized upload in place: %s", src_path.name)
    except Exception as exc:  # pragma: no cover - defensive logging
        logging.error("Failed to replace original image %s: %s", src_path, exc)
        # If replacement fails, attempt to clean up the temp file
        if temp_path.exists():
            try:
                temp_path.unlink()
            except OSError:
                pass


def iter_files(root: Path) -> Iterable[Path]:
    """Yield all files under `root` recursively."""

    for path in root.rglob("*"):
        if path.is_file():
            yield path


def process_tree(
    in_root: Path,
    out_root: Path,
    *,
    options: Optional[OptimizeOptions] = None,
) -> None:
    """
    Walk a directory tree and optimize supported images into `out_root`,
    copying non-image files unchanged.
    """

    if options is None:
        options = OptimizeOptions()

    for src_path in iter_files(in_root):
        rel_path = src_path.relative_to(in_root)
        dst_path = out_root / rel_path

        if src_path.suffix.lower() in SUPPORTED_EXTENSIONS:
            compress_image(src_path, dst_path, options=options)
        else:
            ensure_dir(dst_path.parent)
            dst_path.write_bytes(src_path.read_bytes())
            logging.info("Copied %s", src_path.name)


def create_zip(source_dir: Path, zip_path: Path) -> None:
    """Pack the contents of `source_dir` into a ZIP archive."""

    ensure_dir(zip_path.parent)
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for file_path in iter_files(source_dir):
            arcname = file_path.relative_to(source_dir)
            zf.write(file_path, arcname)

    logging.info("Created zip archive %s", zip_path)


# -------------------------------------------------
# CLI entry point (optional utility)
# -------------------------------------------------

def _parse_args(argv: Optional[Iterable[str]] = None):
    import argparse

    parser = argparse.ArgumentParser(
        description="Batch image optimizer and packer for Still Strava uploads"
    )
    parser.add_argument(
        "input_dir",
        type=Path,
        help="Folder containing the original images",
    )
    parser.add_argument(
        "output_dir",
        type=Path,
        help="Folder where optimized images will be written",
    )
    parser.add_argument(
        "--zip",
        dest="zip_path",
        type=Path,
        default=None,
        help="Optional path of the zip file to create",
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=85,
        help="JPEG quality (1-100), higher means larger files",
    )
    parser.add_argument(
        "--max-dim",
        type=int,
        default=1600,
        help="Resize larger side to this value, keep aspect ratio",
    )

    return parser.parse_args(list(argv) if argv is not None else None)


def main(argv: Optional[Iterable[str]] = None) -> int:
    """CLI wrapper for image optimization."""

    setup_logging()
    args = _parse_args(argv)

    if not args.input_dir.is_dir():
        logging.error("Input directory does not exist: %s", args.input_dir)
        return 1

    ensure_dir(args.output_dir)
    options = OptimizeOptions(quality=args.quality, max_dim=args.max_dim)

    process_tree(args.input_dir, args.output_dir, options=options)

    if args.zip_path:
        create_zip(args.output_dir, args.zip_path)

    return 0


if __name__ == "__main__":  # pragma: no cover - manual CLI use
    raise SystemExit(main())

