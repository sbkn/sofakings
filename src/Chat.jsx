import React from "react";
import io from "socket.io-client";
import qrCode from "qrcode-npm";
import Button from "react-bootstrap/lib/Button";
import FormGroup from "react-bootstrap/lib/FormGroup";
import Jumbotron from "react-bootstrap/lib/Jumbotron";

export default class Chat extends React.Component {

	state = {};

	constructor(props) {

		super(props);
		this._sendMsgToSrv = this._sendMsgToSrv.bind(this);

		let queryParamFromUrl = null;
		if (window.location.href.indexOf("?") > -1) {
			queryParamFromUrl = window.location.href.slice(window.location.href.indexOf("?") + 1);
		}
		console.log("UUID IN URL:", queryParamFromUrl);
		this.uuid = queryParamFromUrl || null;
		const serverConnQuery = this.uuid ? {query: "uuid=" + this.uuid} : null;
		this.socket = io.connect("http://" + window.location.host, serverConnQuery);

		this.init();
	}

	init() {

		this.socket.on("srvMsg", function (msg) {

			console.log("RECEIVED FROM SRV:", msg);
			Chat._handleMsgFromSrv(msg);
		});

		this.socket.on("connAck", msg => {

			console.log("SERVER ACK'ED:", msg);
			this.uuid = msg.uuid;
			let sessionLink = null;
			if (window.location.href.indexOf("?") === -1)
				sessionLink = window.location.href + "?" + this.uuid;
			else
				sessionLink = window.location.href;

			const qr = qrCode.qrcode(4, "M");

			qr.addData(sessionLink);
			qr.make();

			const qrImg = qr.createImgTag(4);
			const foo = qrImg.substr(qrImg.indexOf("\"") + 1);
			const bar = foo.substr(0, foo.indexOf("\""));

			this.setState({sessionLink, qrImgSrc: bar});
		});
	}

	_sendMsgToSrv(e) {

		e.preventDefault();

		const msg = document.getElementById("msgField").value;
		this.socket.emit("clientMsg", msg);
		document.getElementById("msgField").value = "";
		return true;
	}

	static _handleMsgFromSrv(msg) {

		const msgList = document.getElementById("msgList");
		const newElemInList = document.createElement("li");
		newElemInList.innerHTML = msg;
		msgList.appendChild(newElemInList);
	}

	render() {
		return (
			<Jumbotron className="text-center jumbotron-fluid">
				<div className="container">
					<h1>Sofa Kings</h1>

					<img id="qrCode" src={this.state.qrImgSrc}/>
					<a id="sessionLink" href={this.state.sessionLink}>Session
						Link</a>

					<ul id="msgList"></ul>

					<form onSubmit={this._sendMsgToSrv}>
						<FormGroup>
							<input type="text" id="msgField"/>
						</FormGroup>
						<Button type="submit">
							Submit
						</Button>
					</form>
				</div>
			</Jumbotron>
		);
	}
}
