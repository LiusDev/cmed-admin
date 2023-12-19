const { type } = require("os");
const { config } = require("process");

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        config.module.rules.push({
            test: /\.(pdf)$/,
            type: "asset/resource",
        });
        config.resolve.alias.canvas = false;
        return config;
    },
};

module.exports = nextConfig;
