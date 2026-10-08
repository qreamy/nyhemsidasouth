# Southbase Consulting AB

Static multi-page company website.

## Deploy on Vercel

Import this repository, use branch `main`, and leave Root Directory at the repository root. `vercel.json` configures the static site in `dist` with no install or build step.

## Local preview

Run `python3 -m http.server 8080 --directory dist` and open http://localhost:8080.

## Content

Pages are generated with `python3 scripts/build-pages.py`. Shared styling and interactions are in `dist/site.css` and `dist/script.js`.

Contact links currently open email. Direct calendar booking requires connecting a booking provider.
