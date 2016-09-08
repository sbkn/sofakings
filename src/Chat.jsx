import React, {Component} from "react";
import io from "socket.io-client";
import Button from "react-bootstrap/lib/Button";
import FormGroup from "react-bootstrap/lib/FormGroup";
import Jumbotron from "react-bootstrap/lib/Jumbotron";

export default class Chat extends Component {

	constructor(props) {

		super(props);
		this._sendMsgToSrv = this._sendMsgToSrv.bind(this);

		let queryParam = null;
		if (window.location.href.indexOf("?") > -1) {
			queryParam = window.location.href.slice(window.location.href.indexOf("?") + 1);
		}
		console.log("UUID IN URL:", queryParam);
		this.uuid = queryParam || null;
		this.socket = io.connect("http://" + window.location.host, this.uuid ? {query: "uuid=" + this.uuid} : null);

		this.init();
	}

	init() {

		this.socket.on("srvMsg", function (msg) {

			console.log("RECEIVED FROM SRV:", msg);
			const msgList = document.getElementById("msgList");
			const newElemInList = document.createElement("li");
			newElemInList.innerHTML = msg;
			msgList.appendChild(newElemInList);
		});

		this.socket.on("connAck", function (msg) {

			console.log("SERVER ACK'ED:", msg);
			this.uuid = msg.uuid;
			if (window.location.href.indexOf("?") === -1)
				document.getElementById("sessionLink").href = window.location.href + "?" + this.uuid;
			else
				document.getElementById("sessionLink").href = window.location.href;
		});
	}

	_sendMsgToSrv(e) {

		e.preventDefault();

		const msg = document.getElementById("msgField").value;
		this.socket.emit("clientMsg", msg);
		document.getElementById("msgField").value = "";
		return true;
	}

	render() {
		return (
			<Jumbotron className="text-center jumbotron-fluid">
				<div className="container">
					<h1>Sofa Kings</h1>

					<form onSubmit={this._sendMsgToSrv}>
						<FormGroup>
							<input type="text" id="msgField"/>
						</FormGroup>
						<Button type="submit">
							Submit
						</Button>
					</form>

					<a id="sessionLink" href="#">Session Link</a>

					<ul id="msgList"></ul>
				</div>
			</Jumbotron>
		);
	}
}
