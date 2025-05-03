import type { NextConfig } from "next";
import fs from "fs";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.toss.im",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  server: {
    https: {
      key: fs.readFileSync("./ssl/localhost.key"),
      cert: fs.readFileSync("./ssl/localhost.crt"),
    },
    port: 3000,
  },
};

export default nextConfig;
