/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'nkzqbjrebxcanekilmfp.supabase.co',
            port: '',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
