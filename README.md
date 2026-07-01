# RY Website Prototype

Static HTML prototype for the RY corporate website.

## Pages

- `index.html` — Home
- `about.html` — About RY
- `business.html` — Business
- `guide.html` — Investment Guide

## Structure

```text
.
├─ index.html
├─ about.html
├─ business.html
├─ guide.html
├─ images/
│  └─ *.webp
└─ docs/
   └─ RY_Image_Candidate_Mapping.md
```

## Local preview

Open `index.html` directly, or run a local static server from this folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

## Status

This repository contains a design prototype, not production-ready website code. Some copy, figures, legal wording, navigation destinations, and internal explanation features are still provisional.

Image sources and usage rights should be confirmed before public release. Image-selection notes are stored in `docs/RY_Image_Candidate_Mapping.md`.
