import {
  cpSync,
  mkdirSync,
  rmSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import nextConfig from '../next.config.mjs';
import { rootFiles, optionalRootFiles } from './site-manifest.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'out');

const basePath = String(
  process.env.NEXT_PUBLIC_BASE_PATH || nextConfig.basePath || ''
).trim();
console.log(
  'gh-pages-build: NODE_ENV=%s basePath=%s assetPrefix=%s',
  process.env.NODE_ENV,
  basePath || '(empty)',
  nextConfig.assetPrefix || '(empty)'
);

if (existsSync(outDir)) {
  rmSync(outDir, { recursive: true, force: true });
}
mkdirSync(outDir, { recursive: true });

for (const name of rootFiles) {
  const from = join(root, name);
  if (!existsSync(from)) {
    throw new Error(`Missing required file: ${name}`);
  }
  cpSync(from, join(outDir, name));
}

for (const name of optionalRootFiles) {
  const from = join(root, name);
  if (existsSync(from)) {
    cpSync(from, join(outDir, name));
  }
}

const pub = join(root, 'public');
if (!existsSync(pub)) {
  throw new Error('Missing public/ directory');
}
cpSync(pub, join(outDir, 'public'), { recursive: true });

const siteImages = join(root, 'images');
if (existsSync(siteImages)) {
  cpSync(siteImages, join(outDir, 'images'), { recursive: true });
}

/** 生产子路径：把 public/showcase/* 写成 /{basePath}/public/...，避免 <base> 未生效时手机黑块 */
function rewritePublicShowcasePathsInHtml(fileName) {
  if (!basePath) return;
  const filePath = join(outDir, fileName);
  if (!existsSync(filePath)) return;
  const bp = basePath.startsWith('/') ? basePath : `/${basePath}`;
  let html = readFileSync(filePath, 'utf8');
  const next = html
    .replace(/src="public\/showcase\//g, `src="${bp}/public/showcase/`)
    .replace(/href="public\/showcase\//g, `href="${bp}/public/showcase/`);
  if (next !== html) {
    writeFileSync(filePath, next);
    console.log('gh-pages-build: prefixed public/showcase in', fileName);
  }
}

rewritePublicShowcasePathsInHtml('index.html');
rewritePublicShowcasePathsInHtml('layer-demo.html');

const RASTER_EXT = /\.(?:jpe?g|png|webp|gif)(?:\?[^"'#)\s]*)?$/i;
const LOCAL_ASSET_EXT = /\.(?:css|js|jpe?g|png|webp|gif)(?:\?[^"'#)\s]*)?$/i;

function getCacheVersion() {
  const fromEnv = String(process.env.ASSET_VERSION || '').trim();
  if (fromEnv) return fromEnv;
  try {
    return execSync('git rev-parse --short HEAD', {
      cwd: root,
      encoding: 'utf8',
    }).trim();
  } catch {
    return String(Date.now());
  }
}

const cacheVersion = getCacheVersion();
console.log('gh-pages-build: asset cache version', cacheVersion);

/** 手机端 Safari/微信 强缓存同名 jpg；部署时追加 ?v= 强制拉新 */
function bustLocalAssetUrl(url, ver) {
  if (!url || /^https?:\/\//i.test(url) || /^data:/i.test(url)) return url;
  if (url.includes('?v=')) return url;
  const base = url.split('?')[0];
  if (!LOCAL_ASSET_EXT.test(base)) return url;
  return `${base}?v=${ver}`;
}

function bustRasterUrlsInCss(filePath) {
  if (!existsSync(filePath)) return;
  let css = readFileSync(filePath, 'utf8');
  const next = css.replace(
    /url\(\s*(['"]?)([^)'"]+?)\1\s*\)/gi,
    (full, quote, rawUrl) => {
      const trimmed = rawUrl.trim();
      if (!RASTER_EXT.test(trimmed.split('?')[0])) return full;
      const busted = bustLocalAssetUrl(trimmed, cacheVersion);
      return busted === trimmed ? full : `url(${quote}${busted}${quote})`;
    }
  );
  if (next !== css) {
    writeFileSync(filePath, next);
    console.log('gh-pages-build: cache-bust raster urls in', filePath);
  }
}

function bustLocalAssetsInHtml(filePath) {
  if (!existsSync(filePath)) return;
  let html = readFileSync(filePath, 'utf8');
  const next = html.replace(
    /((?:src|href)=["'])([^"']+)(["'])/gi,
    (full, pre, url, suf) => {
      const busted = bustLocalAssetUrl(url, cacheVersion);
      return busted === url ? full : `${pre}${busted}${suf}`;
    }
  );
  if (next !== html) {
    writeFileSync(filePath, next);
    console.log('gh-pages-build: cache-bust assets in', filePath);
  }
}

function injectAssetVersionScript(filePath) {
  if (!existsSync(filePath)) return;
  let html = readFileSync(filePath, 'utf8');
  const tag = `<script>window.__ASSET_VERSION__='${cacheVersion}';</script>`;
  if (html.includes('window.__ASSET_VERSION__')) {
    html = html.replace(
      /<script>window\.__ASSET_VERSION__\s*=\s*['"][^'"]*['"];\s*<\/script>/,
      tag
    );
  } else {
    html = html.replace(
      '<meta charset="UTF-8">',
      `<meta charset="UTF-8">\n    ${tag}`
    );
  }
  writeFileSync(filePath, html);
  console.log('gh-pages-build: injected __ASSET_VERSION__ in', filePath);
}

function applyCacheBustToSite(dir) {
  const base = dir || outDir;
  bustLocalAssetsInHtml(join(base, 'index.html'));
  bustLocalAssetsInHtml(join(base, 'layer-demo.html'));
  bustRasterUrlsInCss(join(base, 'style.css'));
  injectAssetVersionScript(join(base, 'index.html'));
}

applyCacheBustToSite(outDir);
/* Vercel 等从仓库根目录发布时，同步根目录 HTML/CSS，避免手机端仍命中旧缓存 */
applyCacheBustToSite(root);

writeFileSync(join(outDir, '.nojekyll'), '');
writeFileSync(
  join(outDir, 'asset-version.txt'),
  `${cacheVersion}\n`,
  'utf8'
);

console.log('gh-pages-build: wrote', outDir);
