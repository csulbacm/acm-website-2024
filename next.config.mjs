/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		// Allow optimized images from Cloudinary
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
			},
		],
	},
};

export default nextConfig;
