/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        config.module.rules.push({
            test: /\.node/,
            type: "raw-loader",
        })
        config.resolve.alias.canvas = false
        return config
    },
}

module.exports = nextConfig
