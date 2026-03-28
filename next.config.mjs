const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: isProd ? '/-shuizhu-portfolio' : '',
  assetPrefix: isProd ? '/-shuizhu-portfolio/' : '',
  trailingSlash: true,
  output: 'export',
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? '/-shuizhu-portfolio' : '',
  },
};

export default nextConfig;
