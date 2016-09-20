import React from "react";
import Button from "react-bootstrap/lib/Button";
import FormGroup from "react-bootstrap/lib/FormGroup";
import Jumbotron from "react-bootstrap/lib/Jumbotron";
import SessionSharingBase from "./session-sharing-base.jsx";
import uuid from "uuid";

export default class SessionSharing extends SessionSharingBase {

	static propTypes = {
		evaluateQueryString: React.PropTypes.bool,
		showSessionLink: React.PropTypes.bool
	};

	state = {};

	constructor(props) {

		super(props);

		this._sendMsgToSrv = this._sendMsgToSrv.bind(this);

		if (this.props.evaluateQueryString) {
			this._getSessionIdFromUrl();
		} else {
			this.sessionId = uuid.v4();
		}

		this.init();
	}

	_getSessionIdFromUrl() {

		let uuid = null;

		if (window.location.href.indexOf("?") > -1) {
			uuid = window.location.href.slice(
				window.location.href.indexOf("?") + 1
			);
		}

		console.log("UUID IN URL:", uuid);

		if (!uuid) {
			throw new Error("no id in url found!")
		}

		this.sessionId = uuid;
	}

	_sendMsgToSrv(e) {

		e.preventDefault();

		const fileName = e.target.value.substr(e.target.value.lastIndexOf("\\") + 1);

		if (fileName) {

			this.shadows.publish(this.sessionId,
				JSON.stringify({
					fileName
				}),
				{},
				(err, data) => {
					if (err) throw err;

					console.log(err, data);
				});

		}

		return true;
	}

	_handleMessage(name, state) {

		const msgList = document.getElementById("msgList");
		const newElemInList = document.createElement("li");
		newElemInList.innerHTML = state.fileName;

		msgList.appendChild(newElemInList);
	}

	render() {

		return (
			<Jumbotron className="text-center jumbotron-fluid">
				<div className="container">
					<h1>Sofa Kings</h1>

					{
						this.props.showSessionLink ?
							<div>
								<img id="qrCode" src={this.state.qrImgSrc}/>

								<a id="sessionLink"
								   target="_blank"
								   href={"batman.html?" + this.sessionId}>
									Session Link
								</a>
								<p>{this.sessionId}</p>
							</div>
							: null
					}

					<ul id="msgList"/>

					<form onSubmit={this._sendMsgToSrv}>
						<FormGroup>
							<input type="file" onChange={this._sendMsgToSrv}
								   id="fileUploadControl"/>
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
