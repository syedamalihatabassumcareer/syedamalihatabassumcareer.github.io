"""Create a redacted, public copy of the CV for the website.

Removes (by real redaction, not by drawing boxes over text):
  * every line containing a phone number (e.g. the "+880… | City" header line)
  * the whole REFERENCES section, from its heading to the bottom of the page,
    including referee names, emails, phone numbers and their mailto links

Then verifies the output: no phone numbers, no reference emails, no
"REFERENCES" heading, and no links other than the allowed ones.

Usage (from the project root; needs `pip install pymupdf`):
    python scripts/make-public-cv.py <private-cv.pdf> public/cv/Syeda-Maliha-Tabassum-CV.pdf

The original file is never modified.
"""

import re
import sys

import pymupdf

PHONE = re.compile(r"\+?\d[\d\s\-()]{8,}\d")
EMAIL = re.compile(r"[\w.+-]+@[\w-]+(\.[\w-]+)+")
# Only these e-mail addresses may remain in the public copy.
ALLOWED_EMAILS = {"syeda.maliha.tabassum1@g.bracu.ac.bd"}


def redact(src: str, dst: str) -> None:
    doc = pymupdf.open(src)
    for page in doc:
        rects = []
        # 1. Lines with phone numbers.
        for block in page.get_text("dict")["blocks"]:
            for line in block.get("lines", []):
                text = "".join(span["text"] for span in line["spans"])
                if PHONE.search(text):
                    r = pymupdf.Rect(line["bbox"])
                    rects.append(pymupdf.Rect(page.rect.x0, r.y0 - 1, page.rect.x1, r.y1 + 1))
        # 2. REFERENCES heading to the bottom of the page.
        for hit in page.search_for("REFERENCES"):
            rects.append(pymupdf.Rect(page.rect.x0, hit.y0 - 2, page.rect.x1, page.rect.y1))

        for r in rects:
            page.add_redact_annot(r, fill=(1, 1, 1))
            for link in page.get_links():
                if pymupdf.Rect(link["from"]).intersects(r):
                    page.delete_link(link)
        if rects:
            page.apply_redactions(
                images=pymupdf.PDF_REDACT_IMAGE_REMOVE,
                graphics=pymupdf.PDF_REDACT_LINE_ART_REMOVE_IF_TOUCHED,
            )

    doc.set_metadata({"title": "Syeda Maliha Tabassum — CV", "author": "Syeda Maliha Tabassum"})
    doc.save(dst, garbage=4, deflate=True, clean=True)
    doc.close()


def verify(path: str) -> list[str]:
    problems = []
    doc = pymupdf.open(path)
    for i, page in enumerate(doc, start=1):
        text = page.get_text("text")
        for m in PHONE.finditer(text):
            problems.append(f"page {i}: phone-like text {m.group(0)!r}")
        for m in EMAIL.finditer(text):
            if m.group(0) not in ALLOWED_EMAILS:
                problems.append(f"page {i}: unexpected e-mail {m.group(0)!r}")
        if "REFERENCES" in text:
            problems.append(f"page {i}: REFERENCES heading still present")
        for link in page.get_links():
            uri = link.get("uri") or ""
            if uri.startswith("mailto:") and uri[7:] not in ALLOWED_EMAILS:
                problems.append(f"page {i}: unexpected mailto link {uri}")
    doc.close()
    return problems


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src, dst = sys.argv[1], sys.argv[2]
    redact(src, dst)
    issues = verify(dst)
    if issues:
        print("Redaction verification FAILED:")
        print("\n".join(f"  - {p}" for p in issues))
        sys.exit(1)
    print(f"OK: wrote {dst} and verified that it has no phone numbers, reference contacts or extra e-mails.")
