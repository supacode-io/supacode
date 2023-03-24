/** @type {import('next').NextConfig} */
require('./utils/load-env');

const nextConfig = {
	env: {
		SERVER_URL: process.env.SERVER_URL,
	},
	reactStrictMode : true,
	swcMinify       : true,
	webpack(config) {
		const newConfig = { ...config };
		newConfig.module.rules.push({
			test : /\.svg$/i,
			use  : [{ loader: '@svgr/webpack' }],
		});
		return config;
	},
	redirects() {
		return [
			{
				source      : '/app/:projectCode',
				destination : '/app/:projectCode/vault',
				permanent   : false,
			},
		];
	},
};

module.exports = nextConfig;
