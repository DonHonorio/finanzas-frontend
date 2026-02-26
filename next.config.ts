import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: 'standalone',
  /* config options here */
  distDir: '.next', // Fuerza que .next se genere en el directorio actual (frontend/)
}

export default nextConfig
