var path = require("path");
var webpack = require("webpack");

module.exports = {

	devtool: "eval",
	target: "web",

	entry: {
		mothman: ["./src/views/mothman.jsx", 'webpack/hot/only-dev-server'],
		batman: ["./src/views/batman.jsx", 'webpack/hot/only-dev-server'],
		client: 'webpack-dev-server/client?http://0.0.0.0:8080'
	},

	node: {
		fs: "empty",
		tls: "empty"
	},

	output: {
		path: path.join(__dirname, "static"),
		filename: "[name].js",
		publicPath: "/static/"
	},

	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.IgnorePlugin(/vertx/),
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
			/someRegEx/
		]
	},

	resolve: {
		alias: {
			"myCustomModule": "pathRelativeToNodeModules"
		}
	}
};
