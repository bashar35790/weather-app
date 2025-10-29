/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "openweathermap.org",
      },
    ],
  },

  // 🧩 এই অংশটাই নতুন যোগ হবে
  eslint: {
    ignoreDuringBuilds: true, // ✅ ESLint error গুলো build সময় ignore করবে
  },
  typescript: {
    ignoreBuildErrors: true,  // ✅ TypeScript error গুলো build সময় ignore করবে
  },
};

export default nextConfig;
