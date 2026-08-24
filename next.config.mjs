/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pdf-parse', 'tesseract.js'],
  turbopack: {},
};

export default nextConfig;
