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

const pub = join(root, 'public');
if (!existsSync(pub)) {
  throw new Error('Missing public/ directory');
}
cpSync(pub, join(outDir, 'public'), { recursive: true });

console.log('gh-pages-build: wrote', outDir);
