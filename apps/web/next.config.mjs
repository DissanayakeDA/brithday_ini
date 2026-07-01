/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // @bday/shared ships compiled CommonJS in its dist/, so no transpile is
  // needed. Listing it here is harmless and future-proofs source consumption.
  // three + the react-three packages ship ESM that Next bundles more reliably
  // when transpiled here (avoids stray ESM/CJS interop errors in the build).
  transpilePackages: [
    "@bday/shared",
    "three",
    "@react-three/fiber",
    "@react-three/drei",
  ],
  // TypeScript errors still fail the build; linting is run separately via
  // `npm run lint` so a stray lint rule never blocks a deploy.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
