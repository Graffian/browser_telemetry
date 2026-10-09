/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ?? (isProd ? "/browser_telemetry" : "");

const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  images: { unoptimized: true },
  trailingSlash: true
};

export default nextConfig;
