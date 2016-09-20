var path = require("path");
var webpack = require("webpack");

module.exports = {

	devtool: "eval",
	target: "web",

	entry: {
		"mothman": "./src/views/mothman.jsx",
		"batman": "./src/views/batman.jsx"
	},

	node: {
		fs: "empty",
		tls: "empty"
	},

	output: {
		path: path.join(__dirname, "dist"),
		filename: "[name].js",
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
			/libs/
		]
	},

	resolve: {
		alias: {
			"aws-sdk": "aws-sdk/dist/aws-sdk.min.js"
		}
	}
};
