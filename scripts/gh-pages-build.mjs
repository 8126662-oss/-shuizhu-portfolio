import { cpSync, mkdirSync, rmSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import nextConfig from '../next.config.mjs';
import { rootFiles, optionalRootFiles } from './site-manifest.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'out');

const basePath = nextConfig.basePath || '';
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

console.log('gh-pages-build: wrote', outDir);
