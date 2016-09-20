import React from "react";
import Button from "react-bootstrap/lib/Button";
import FormGroup from "react-bootstrap/lib/FormGroup";
import Jumbotron from "react-bootstrap/lib/Jumbotron";
import AWSConfiguration from "../aws-configuration.es6";
import AWSIoTData from "../../libs/aws-iot-sdk-browser-bundle";
import "aws-sdk";

AWS = window.AWS;

export default class Chat extends React.Component {

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

	init() {

		console.log('Loaded AWS SDK for JavaScript and AWS IoT SDK for Node.js');

		this.shadows = AWSIoTData.thingShadow({
			//
			// Set the AWS region we will operate in.
			//
			region: AWS.config.region,
			//
			// Use a random client ID.
			//
			clientId: Math.random().toString(),
			//
			// Connect via secure WebSocket
			//
			protocol: 'wss',
			//
			// Set the maximum reconnect time to 8 seconds; this is a browser application
			// so we don't want to leave the user waiting too long for reconnection after
			// re-connecting to the network/re-opening their laptop/etc...
			//
			maximumReconnectTimeMs: 8000,
			//
			// Enable console debugging information (optional)
			//
			debug: true,
			//
			// IMPORTANT: the AWS access key ID, secret key, and sesion token must be
			// initialized with empty strings.
			//
			accessKeyId: '',
			secretKey: '',
			sessionToken: ''
		});

		this.shadows.on('message', (name, stateObject) => {

			stateObject = JSON.parse(stateObject.toString());

			console.log("message", stateObject, name);

			const msgList = document.getElementById("msgList");
			const newElemInList = document.createElement("li");
			newElemInList.innerHTML = stateObject.msg;

			msgList.appendChild(newElemInList);
		});

		this.shadows.on('status', (name, statusType, clientToken, stateObject) => {

			console.log("status", stateObject, statusType);

			if (statusType === 'rejected') {

				if (stateObject.code !== 404) {

					console.log('resync with thing shadow');

					var opClientToken = shadows.get(name);

					if (opClientToken === null) {
						console.log('operation in progress');
					}
				}
			} else { // statusType === 'accepted'

			}
		});

		window.shadowConnectHandler = () => {
			console.log('connect');

			if (!this.shadowsRegistered) {

				this.shadows.subscribe(this.serverConnQuery, {

					persistentSubscribe: true,
					qos: 0
				});

				this.shadowsRegistered = true;
			}

			console.log(this.shadowsRegistered, this.shadows);
		};
		window.shadowReconnectHandler = () => {
			console.log('reconnect');
		};

		this.shadows.on('connect', window.shadowConnectHandler);
		this.shadows.on('reconnect', window.shadowReconnectHandler);

		var cognitoIdentity = new AWS.CognitoIdentity();
		AWS.config.credentials.get((err, data) => {

			if (!err) {

				console.log('retrieved identity: ' + AWS.config.credentials.identityId);

				var params = {
					IdentityId: AWS.config.credentials.identityId
				};

				cognitoIdentity.getCredentialsForIdentity(params, (err, data) => {
					if (!err) {

						this.shadows.updateWebSocketCredentials(
							data.Credentials.AccessKeyId,
							data.Credentials.SecretKey,
							data.Credentials.SessionToken);

					} else {

						console.log('error retrieving credentials: ' + err);
					}
				});

			} else {

				console.log('error retrieving identity:' + err);
			}
		});
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
