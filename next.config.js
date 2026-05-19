/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'img.freepik.com' },
      { protocol: 'https', hostname: 't3.ftcdn.net' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      { protocol: 'https', hostname: '**.exactdn.com' },
      { protocol: 'https', hostname: 'www.hindustantimes.com' },
      { protocol: 'https', hostname: '**.ftcdn.net' },
    ],
  },
};

module.exports = nextConfig;
