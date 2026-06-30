/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // @bday/shared ships compiled CommonJS in its dist/, so no transpile is
  // needed. Listing it here is harmless and future-proofs source consumption.
  transpilePackages: ["@bday/shared"],
  // TypeScript errors still fail the build; linting is run separately via
  // `npm run lint` so a stray lint rule never blocks a deploy.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
