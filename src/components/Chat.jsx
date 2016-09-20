import React from "react";
import Button from "react-bootstrap/lib/Button";
import FormGroup from "react-bootstrap/lib/FormGroup";
import Jumbotron from "react-bootstrap/lib/Jumbotron";
import AWSConfiguration from "../aws-configuration.es6";
import SessionSharingBase from "./session-sharing-base.jsx";

export default class Chat extends SessionSharingBase {

	state = {};

	constructor(props) {

		super(props);

		this.shadowsRegistered = false;

		this._sendMsgToSrv = this._sendMsgToSrv.bind(this);

		let queryParamFromUrl = null;

		if (window.location.href.indexOf("?") > -1) {
			queryParamFromUrl = window.location.href.slice(
				window.location.href.indexOf("?") + 1
			);
		}

		console.log("UUID IN URL:", queryParamFromUrl);

		this.uuid = queryParamFromUrl || null;

		this.serverConnQuery = this.uuid ? this.uuid : Math.random().toString();

		AWS.config.region = AWSConfiguration.region;

		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: AWSConfiguration.poolId
		});

		this.init();
	}

	_sendMsgToSrv(e) {

		e.preventDefault();

		const msg = document.getElementById("msgField").value;

		if (msg) {

			this.shadows.publish(this.serverConnQuery,
				JSON.stringify({
					msg
				}),
				{},
				(err, data) => {
					if (err) throw err;

					console.log(err, data);
				});

			document.getElementById("msgField").value = "";
		}

		return true;
	}

	render() {
		return (
			<Jumbotron className="text-center jumbotron-fluid">
				<div className="container">
					<h1>Sofa Kings</h1>

					<img id="qrCode" src={this.state.qrImgSrc}/>

					<a id="sessionLink" href={this.state.sessionLink}>
						Session Link
					</a>

					<ul id="msgList"/>

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
