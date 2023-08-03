module.exports = {
  env: {
    HEDERA_PRIVATE_KEY: process.env.HEDERA_PRIVATE_KEY
  },
  reactStrictMode: true,
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false
    }

    return config
  }
}
