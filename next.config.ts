import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

const nextConfig: NextConfig = {
  output: 'standalone',
  /* config options here */
  distDir: '.next', // Fuerza que .next se genere en el directorio actual (frontend/)
}

export default withNextIntl(nextConfig)
