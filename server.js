const http = require("http");
const express = require("express");
const uuidModule = require("uuid");


const webpack = require("webpack");
const webpackConfig = require("./webpack.config");
const compiler = webpack(webpackConfig);

const app = express();

app.use(require("webpack-dev-middleware")(compiler, {
	noInfo: true,
	publicPath: webpackConfig.output.publicPath
}));

app.use(require("webpack-hot-middleware")(compiler));

app.get("/", function (req, res) {

	//res.render("index.html");
	res.sendFile(__dirname + "/index.html");
});

app.use(express.static("static"));

const server = new http.Server(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, function () {
	console.log("Listening at http://localhost:" + PORT + "/");
});

io.on("connection", function (socket) {

	console.log("a user connected.");

	var uuid = socket.handshake.query.uuid || uuidModule.v1();

	console.log("SET UUID:", uuid);
	socket.join(uuid);
	socket.emit("connAck", {uuid: uuid});

	socket.on("disconnect", function () {
		console.log("user disconnected");
	});

	socket.on("clientMsg", function (msg) {
		console.log("message: " + msg);

		io.to(uuid).emit("srvMsg", "msg: <b>" + msg + "</b>");
	});
});