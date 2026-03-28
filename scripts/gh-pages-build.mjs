import { cpSync, mkdirSync, rmSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import nextConfig from '../next.config.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'out');

const basePath = nextConfig.basePath || '';
console.log('gh-pages-build: NODE_ENV=%s basePath=%s', process.env.NODE_ENV, basePath || '(empty)');

const rootFiles = [
  'index.html',
  'layer-demo.html',
  'style.css',
  'performance-optimizations.css',
  'fix-lazy-loading.css',
  'EMERGENCY_GREEN_BOX_FIX.css',
];

/** Referenced by index.html / layer-demo; copy when present so GitHub Pages out/ stays complete */
const optionalRootFiles = [
  'RESTORE_ORIGINAL_ANIMATION.css',
  'REMOVE_ALL_MODIFICATIONS.js',
  'dynamic-border-ratio.js',
  'mobile-optimizations.css',
  'mobile-image-fix.css',
  'mobile-performance-optimizer.js',
  'mobile-image-emergency-fix.js',
];

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

console.log('gh-pages-build: wrote', outDir);
