const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const package = require('./package.json');
require('core-js');
require('regenerator-runtime');

const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'src');

const HtmlConfig = new HtmlWebpackPlugin({
	filename: 'index.html',
	template: APP_DIR+'/index.html',
	title: package.name
});

module.exports = (_env, argv) => ({
	devServer: {
		compress: true,
		historyApiFallback: true,
		hot: true,
		overlay: true
	},
	devtool: argv.mode === 'production' ? "" : "inline-source-map",
	entry: {
		app: [ 'core-js/stable', 'regenerator-runtime/runtime', APP_DIR+'/index.js' ]
	},
	module: {
		rules: [
			{ include: APP_DIR, loader: 'babel-loader', test: /\.jsx?/ },
			{ test: /\.(sa|sc|c)ss/, use: [
				argv.mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
				'css-loader',
				'sass-loader'
			] },
			{ test: /\.worker\.js$/, use: { loader: 'worker-loader' } }
		]
	},
	output: {
		filename: argv.mode === 'production' ? '[name].[contenthash].js' : 'build.js',
		globalObject: 'this',
		path: BUILD_DIR,
		publicPath: '/'
	},
	plugins: [
		HtmlConfig,
		new MiniCssExtractPlugin({
			chunkFilename: argv.mode === 'production' ? '[id].[contenthash].css' : '[id].css',
			filename: argv.mode === 'production' ? '[name].[contenthash].css' : '[name].css'
		})
	].concat(argv.hot ? [
	] : [
		new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false, reportFilename: '../report.html' })
	]),
	resolve: {
		alias: {
			...Object.assign({}, argv.hot ? { 'react-dom': '@hot-loader/react-dom' } : { })
		},
		extensions: ['.js', '.json', '.sass', '.scss'],
		modules: [APP_DIR, "node_modules"]
	},
	node: {
		fs: 'empty'
	}
});
