import { cpSync, mkdirSync, rmSync, existsSync, readFileSync, writeFileSync } from 'fs';
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

console.log('gh-pages-build: wrote', outDir);
