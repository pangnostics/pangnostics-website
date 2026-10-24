# Pangnostics website

Static HTML, CSS and JavaScript. Open index.html to preview locally; no build or package installation is required. Keep the assets folder alongside the four HTML pages.

## GitHub Pages

Publish from the main branch and repository root using Settings > Pages > Deploy from a branch. The .nojekyll file preserves direct static delivery. Commit the selected assets/videos files with ordinary Git; this package does not use Git LFS. Large videos require Git or GitHub Desktop instead of the browser upload form.

## Cloudflare Web Analytics

The Cloudflare Web Analytics public site token is configured in assets/js/analytics-config.js. Clearing that token disables collection. Live dashboard receipt must be checked after deployment. The loader runs only on HTTPS pangnostics.com and www.pangnostics.com; local files, localhost and GitHub staging URLs do not send analytics. The identifier is public and is not an API key.

Do not add a second Cloudflare snippet. Separate HTML page loads are tracked; section navigation is not treated as extra page views. Custom video and contact-button events are not configured.

## Media attribution

The EV journey player provides Music credits. The corresponding credit is also retained in assets/videos/EV-journey-M25-MUSIC-CREDIT.txt. No media rights are changed by this repository.
