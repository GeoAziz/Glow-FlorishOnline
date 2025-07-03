import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack(config, { isServer }) {
    // Required for farmhash-modern, a dependency of Genkit
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    if (isServer) {
        // Genkit dependencies that are not needed for the client-side build
        config.externals.push('farmhash-modern');
        config.externals.push('handlebars');
    }
    
    config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';
    
    return config;
  },
};

export default nextConfig;
