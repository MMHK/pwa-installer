const webpack = require('webpack');
const {globSync} = require("glob");
const glob = require("glob");
const path = require("path");
const fs = require("fs");
const frp = require("mmhk-frp");
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const http = require('http');

const FRP_ENDPOINT = process.env.FRP_ENDPOINT || 'localhost';
const FRP_ENDPOINT_PORT = process.env.FRP_ENDPOINT_PORT || 7000;
const FRP_API_PORT = process.env.FRP_ENDPOINT_PORT || 7001;
const FRP_API_USER = process.env.FRP_API_USER || 'admin';
const FRP_API_PWD = process.env.FRP_API_PWD || 'admin';
const FRP_PUBLIC_DOMAIN = process.env.FRP_PUBLIC_DOMAIN || 'localhost';
const isDevServer = process.env.WEBPACK_DEV_SERVER || process.env.WEBPACK_SERVE;

const checkSubDomainExist = (domain) => {
	const auth = `${FRP_API_USER}:${FRP_API_PWD}`;

	return new Promise((resolve, reject) => {
		const req = http.get({
			hostname: FRP_ENDPOINT,
			port: FRP_API_PORT,
			path: '/api/proxy/http',
			headers: { 'Content-Type': 'application/json' },
			auth: auth,
		}, (resp) => {
			resp.setEncoding('utf8');
			let data = '';

			// A chunk of data has been received.
			resp.on('data', (chunk) => {
				data += chunk;
			});

			// The whole response has been received. Print out the result.
			resp.on('end', () => {
				let json = {};
				try {
					json = JSON.parse(data);
					resolve(json);
				} catch (err) {
					reject(err)
				}
			});

		});
		req.on('error', (err) => {
			console.error(`http error: ${err}`);
			reject(err);
		});
		req.end();
	})
		.then((data) => {
			const list = Array.from(data.proxies || []);
			if (list.find((row) => {
				return row.name === domain && row.status === 'online';
			})) {
				return Promise.resolve(true);
			}

			return Promise.resolve(false);
		})
}

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const {InjectManifest} = require('workbox-webpack-plugin');

const config = {
	mode: 'development',
	entry: [
		'./src/test/main.js',
	],

	output: {
		path: path.resolve(__dirname, 'docs'),
		chunkFilename: 'js/[name].js',
		filename: 'js/[name].js',
		assetModuleFilename: 'assets/[hash][ext][query]',
		publicPath: isDevServer ? "auto" : '/pwa-installer/',
	},

	resolve: {
		alias: {
			'vue$': (process.env.NODE_ENV === 'development' ?
				"vue/dist/vue.esm.js" :
				"vue/dist/vue.min.js"),
			'env$': process.env.NODE_ENV === 'production' ?
				path.resolve(__dirname, 'src/test/env.production.js') :
				path.resolve(__dirname, 'src/test/env.development.js'),
		}
	},

	plugins: [
		new webpack.ProgressPlugin(),

		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// all options are optional
			filename: 'css/[name].css',
			// chunkFilename: 'css/[id].css',
			ignoreOrder: false, // Enable to remove warnings about conflicting order
		}),

		new CleanWebpackPlugin(),

		new VueLoaderPlugin(),

		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: isDevServer ? path.resolve(__dirname, 'src/test/index.html') :  path.resolve(__dirname, 'public/docs.html'),
			hash: false,
		})
	],

	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /.(js)$/,
				include: [
					path.resolve(__dirname, 'src'),
				],
				exclude: /(node_modules|webpack)/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							plugins: [
								[
									"@babel/plugin-transform-template-literals", {
									loose: true
								}],
								"@babel/plugin-transform-runtime",
								"@babel/plugin-syntax-dynamic-import"
							],

							presets: [
								[
									'@babel/preset-env',
									{
										modules: false,
										useBuiltIns: "usage",
										corejs: 3
									}
								]
							]
						}
					},
				],

			},
			{
				test: /\.html$/,
				use: [
					{ loader: 'html-loader' },
				]
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									["autoprefixer"],
								],
							},
							sourceMap: true,
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						}
					},
				],
			},
			{
				test: /\.(mov|mp4|mp3|wav|ogg|pdf)$/i,
				type: "asset/resource",
				generator: {
					filename: 'assets/videos/[hash][ext][query]'
				},
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'assets/fonts/[hash][ext][query]'
				},
				parser: {
					dataUrlCondition: {
						maxSize: 4 * 1024 // 4kb
					}
				},
			},
			{
				test: /\.(|png|jpe?g|gif)$/i,
				type: 'asset',
				generator: {
					filename: 'assets/img/[hash][ext][query]'
				},
			},
			{
				test: /\.css$/,
				use: [
					'vue-style-loader',
					'css-loader'
				]
			},
		]
	},

	optimization: {
		splitChunks: {
			chunks: 'async',
			minChunks: 1,
			name: false
		},

		minimize: false,
	},

	devtool: "source-map",
	// watch: process.env.NODE_ENV === 'development',
	watchOptions: {
		ignored: /(node_modules|webpack)/
	},
	devServer: {
		open: true,
		compress: true,
		allowedHosts: [
			"localhost",
			".demo2.mixmedia.com",
		],
		static: {
			serveIndex: true,
		}
	}
};

// const unixTimeInSeconds = Math.floor(Date.now() / 1000);
const pwaConfig = [
	new FaviconsWebpackPlugin({
		// Your source logo (required)
		logo: path.resolve(__dirname, 'public/assets/logo.png'),
		// Enable caching and optionally specify the path to store cached data
		// Note: disabling caching may increase build times considerably
		cache: true,
		inject: true,
		mode: 'webapp', // optional can be 'webapp' or 'light' - 'webapp' by default
		devMode: 'webapp', // optional can be 'webapp' or 'light' - 'light' by default
		prefix: '',
		outputPath: `assets/favicon`,
		publicPath: isDevServer ? `/assets/favicon` : `/pwa-installer/assets/favicon`,
		favicons: {
			start_url: "/",
			appName: 'PWA installer Demo',
			appShort: 'PWA installer Demo',
			appDescription: "PWA demo",
			display: "standalone",
			background: '#ffffff',
			theme_color: '#ffffff',
			version: "1.0",
			icons: {
				android: true,
				appleIcon: true,
				appleStartup: false,
				favicons: true,
				windows: true,
			},
			orientation: "landscape",
		}
	}), new InjectManifest({
		maximumFileSizeToCacheInBytes: 30 * 1024 * 1024,
		swSrc: path.resolve(__dirname, "src/test/service-worker.js"),
		swDest: isDevServer ? "service-worker.js" : path.resolve(__dirname, "docs/service-worker.js"),
	})
];

if (!isDevServer) {
	config.plugins.unshift(new webpack.DefinePlugin({
		__PWA_DISABLED__ : JSON.stringify(false),
	}));
	config.plugins.push(...pwaConfig);
	module.exports = config;
	return;
}

module.exports = prompt([
	{
		type: 'list',
		name: 'public',
		message: '请问是否允外网访问',
		choices: [
			{
				name: "允许",
				value: true
			},
			{
				name: "不需要",
				value: false
			},
		],
	},
	{
		type: 'input',
		name: 'subdomain',
		message: '请配一个霸气的域名',
		validate: (input) => {
			return /^([a-z0-9\-]{4,})$/i.test(input);
		},
		when: ({public}) => {
			return public;
		}
	},
	{
		type: 'list',
		name: 'usePWA',
		message: '是否使用PWA组件',
		choices: [
			{
				name: "使用",
				value: true
			},
			{
				name: "不需要",
				value: false
			},
		],
	},
]).then(({public, subdomain, usePWA}) => {
	if (usePWA) {
		config.plugins.push(...pwaConfig);
	}

	config.plugins.unshift(new webpack.DefinePlugin({
		__PWA_DISABLED__ : JSON.stringify(!(usePWA)),
	}));

	return Promise.resolve({
		...config,
		devServer: {
			...config.devServer,
			client: !public ? {} : {
				webSocketURL: `https://${subdomain}.${FRP_PUBLIC_DOMAIN}/ws`,
			},
			open: !public ? true : {
				target: `https://${subdomain}.${FRP_PUBLIC_DOMAIN}`,
			},
			allowedHosts: [
				`.${FRP_PUBLIC_DOMAIN}`,
			],
			onListening: (devServer) => {
				if (!devServer) {
					throw new Error('webpack-dev-server is not defined');
				}
				if (!public) {
					return;
				}
				const addr = devServer.server.address();

				console.log('set domain:', subdomain);

				checkSubDomainExist(subdomain)
					.then((exist) => {
						if (!exist) {
							let conf = {
									common: {
										serverPort: FRP_ENDPOINT_PORT,
										serverAddr: FRP_ENDPOINT,
									},
								};
							conf[subdomain] = {
								type: "http",
								localIp: "127.0.0.1",
								localPort: addr.port,
								subdomain,
							};

							return frp.startClient(conf);
						}
						return Promise.reject(new Error('已经有人使用此霸气的名字'));
					})
					.catch((err) => {
						console.error(err);
						return Promise.reject(err);
					})
			},
		}
	})
})
