var path = require("path");
var webpack = require("webpack");

module.exports = {
	devtool: "eval",
	target: "web",
	entry: [
		"webpack-dev-server/client?http://localhost:8080",
		"webpack/hot/only-dev-server",
		"./src/index.jsx"
	],
	node: {
		fs: "empty",
		tls: "empty"
	},
	output: {
		path: path.join(__dirname, "dist"),
		filename: "bundle.js",
		publicPath: "/static/"
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	],
	module: {
		loaders: [
			{
				test: /\.(jsx|es6|js)/,
				loaders: ["react-hot", "babel"],
				include: path.join(__dirname, "src")
			}
		],
		noParse: [
			/aws\-sdk/,
			/aws\-iot\-device\-sdk/

		]
	},
	resolve: {
		alias: {
			"aws-sdk": "aws-sdk/dist/aws-sdk.min.js"
		}
	}
};
