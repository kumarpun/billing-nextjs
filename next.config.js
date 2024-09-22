// next.config.js
module.exports = {
    reactStrictMode: true, // Keep this for identifying issues in dev mode
    typescript: {
      ignoreBuildErrors: true, // Temporarily disable TypeScript errors during build
    },
    eslint: {
      ignoreDuringBuilds: true, // Temporarily disable ESLint errors during build
    },
    swcMinify: true, // Enable SWC minification for better performance
  };
  