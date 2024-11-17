/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"], // Agregamos el dominio de Google para las imágenes
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nkzqbjrebxcanekilmfp.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
