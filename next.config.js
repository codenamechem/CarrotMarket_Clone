/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    reactRoot: true,
  },
  images: {
    //외부 저장소 이미지 불러올 때 적어줌
    domains: ["imagedelivery.net"],
  },
};

module.exports = nextConfig;
