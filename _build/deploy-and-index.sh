#!/bin/bash
set -e

echo "▶ Pulling latest..."
git pull

echo "▶ Deploying to Cloudflare Pages..."
CLOUDFLARE_ACCOUNT_ID=c0315f16ce890854b64f6900b566916a npx --yes wrangler@latest pages deploy . --project-name=snailsploit --branch=main --commit-dirty=true

echo ""
echo "▶ Pinging IndexNow (Bing, Yandex, Naver, Seznam) with all URLs..."
curl -sS -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d @_build/indexnow-payload.json \
  -w "\nHTTP %{http_code}\n"

echo ""
echo "▶ Pinging Google sitemap..."
curl -sS "https://www.google.com/ping?sitemap=https://snailsploit.com/sitemap.xml" -o /dev/null -w "HTTP %{http_code}\n"

echo ""
echo "▶ Pinging Bing sitemap..."
curl -sS "https://www.bing.com/ping?sitemap=https://snailsploit.com/sitemap.xml" -o /dev/null -w "HTTP %{http_code}\n"

echo ""
echo "✓ Deploy + index push complete."
echo ""
echo "Next:"
echo "  - Search Console: search.google.com/search-console → Sitemaps → submit /sitemap.xml"
echo "  - Bing Webmaster: bing.com/webmasters → Add site → Submit sitemap"
echo "  - HSTS preload (optional): hstspreload.org → submit snailsploit.com"
