const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: isProd ? '/-shuizhu-portfolio' : '',
  assetPrefix: isProd ? '/-shuizhu-portfolio/' : '',
  /** GitHub Pages：尾斜杠 + 目录式 index 在移动端更稳（Next 导出时生效） */
  trailingSlash: true,
  output: 'export',
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? '/-shuizhu-portfolio' : '',
  },
};

export default nextConfig;
