const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/-shuizhu-portfolio' : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath,
  assetPrefix: basePath || undefined,
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
