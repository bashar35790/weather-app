
module.exports = {
  images: {
    remotePatterns:[
      {
        protocol:"https",
        hostname:"openweathermap.org",
      }
    ]
  }
};
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig