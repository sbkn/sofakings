import React from "react";
import AWSIoTData from "../../libs/aws-iot-sdk-browser-bundle";
import "aws-sdk";
import AWSConfiguration from "../aws-configuration.es6";

AWS = window.AWS;

export default class SessionSharingBase extends React.Component {

	constructor(props) {
		super(props);

		this.shadowConnectHandler = this.shadowConnectHandler.bind(this);
		this.shadowReconnectHandler = this.shadowReconnectHandler.bind(this);

		this.shadowsRegistered = false;

		AWS.config.region = AWSConfiguration.region;

		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: AWSConfiguration.poolId
		});
	}

	_handleMessage(name, state) {

		return null;
	}

	shadowConnectHandler() {

		console.log('connect');

		if (!this.shadowsRegistered) {

			this.shadows.subscribe(this.state.sessionId, {

				persistentSubscribe: true,
				qos: 0
			});

			this.shadows.subscribe(this.state.sessionId + "-established", {

				persistentSubscribe: true,
				qos: 0
			});

			this.shadowsRegistered = true;
		}

		if (!this.props.showSessionLink) {
			this.shadows.publish(this.state.sessionId + "-established",
				JSON.stringify({
					platform: window.navigator.platform
				}),
				{},
				(err, data) => {
					if (err) throw err;

					console.log(err, data);
				});
		}
	}

	shadowReconnectHandler() {
		console.log('reconnect');
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

			this._handleMessage(name, stateObject);
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

		this.shadows.on('connect', this.shadowConnectHandler);

		this.shadows.on('reconnect', this.shadowReconnectHandler);

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

	render() {
		return null;
	}
}