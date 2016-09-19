import React from "react";
import Button from "react-bootstrap/lib/Button";
import FormGroup from "react-bootstrap/lib/FormGroup";
import Jumbotron from "react-bootstrap/lib/Jumbotron";
import AWSConfiguration from "./aws-configuration.es6";
import AWSIoTData from "aws-iot-device-sdk/browser/aws-iot-sdk-browser-bundle";
import "aws-sdk";

AWS = window.AWS;

export default class Chat extends React.Component {

	state = {};

	static topic = "hans";

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

		const serverConnQuery = this.uuid ? {
			query: "uuid=" + this.uuid
		} : null;

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
			clientId: "2",
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

		this.shadows.on('delta', function (name, stateObject) {

			console.log("delta", stateObject, name);

			if (name === 'vwfs-dmks-prodi-session-sharing-thing') {

				document.getElementById('temperature-monitor-div').innerHTML = '<p>interior: ' + stateObject.state.intTemp + '</p>' +
					'<p>exterior: ' + stateObject.state.extTemp + '</p>' +
					'<p>state: ' + stateObject.state.curState + '</p>';

			} else { // name === 'TemperatureControl'
				var enabled = stateObject.state.enabled ? 'enabled' : 'disabled';
				document.getElementById('temperature-control-div').innerHTML = '<p>setpoint: ' + stateObject.state.setPoint + '</p>' +
					'<p>mode: ' + enabled + '</p>';
			}
		});

		this.shadows.on('status', function (name, statusType, clientToken, stateObject) {

			console.log("status", stateObject, statusType);

			if (statusType === 'rejected') {
				//
				// If an operation is rejected it is likely due to a version conflict;
				// request the latest version so that we synchronize with the shadow
				// The most notable exception to this is if the thing shadow has not
				// yet been created or has been deleted.
				//
				if (stateObject.code !== 404) {

					console.log('resync with thing shadow');

					var opClientToken = shadows.get(name);

					if (opClientToken === null) {
						console.log('operation in progress');
					}
				}
			} else { // statusType === 'accepted'

				if (name === 'vwfs-dmks-prodi-session-sharing-thing') {
					document.getElementById('temperature-monitor-div').innerHTML = '<p>interior: ' + stateObject.state.desired.intTemp + '</p>' +
						'<p>exterior: ' + stateObject.state.desired.extTemp + '</p>' +
						'<p>state: ' + stateObject.state.desired.curState + '</p>';
				} else { // name === 'TemperatureControl'
					var enabled = stateObject.state.desired.enabled ? 'enabled' : 'disabled';
					document.getElementById('temperature-control-div').innerHTML = '<p>setpoint: ' + stateObject.state.desired.setPoint + '</p>' +
						'<p>    mode: ' + enabled + '</p>';
				}
			}
		});

		window.shadowConnectHandler = () => {
			console.log('connect');

			if (!this.shadowsRegistered) {

				this.shadows.subscribe(Chat.topic, {

					persistentSubscribe: true,
					qos: 0
				});

				this.shadowsRegistered = true;
			}

			console.log(this.shadowsRegistered, this.shadows);
		};
		window.shadowReconnectHandler = function () {
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
						alert('error retrieving credentials: ' + err);
					}
				});

			} else {

				console.log('error retrieving identity:' + err);
				alert('error retrieving identity: ' + err);
			}
		});
	}

	_sendMsgToSrv(e) {

		e.preventDefault();

		const msg = document.getElementById("msgField").value;

		if (msg) {

			this.shadows.publish(Chat.topic,
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
