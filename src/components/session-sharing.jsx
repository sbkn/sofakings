import React from "react";
import Button from "react-bootstrap/lib/Button";
import FormGroup from "react-bootstrap/lib/FormGroup";
import Jumbotron from "react-bootstrap/lib/Jumbotron";
import SessionSharingBase from "./session-sharing-base.jsx";

export default class SessionSharing extends SessionSharingBase {

	state = {};

	static propTypes = {
		evaluateQueryString: React.PropTypes.bool,
		showSessionLink: React.PropTypes.bool
	};

	constructor(props) {

		super(props);

		this._sendMsgToSrv = this._sendMsgToSrv.bind(this);

		if (this.props.evaluateQueryString) {
			this._getIdFromUrl();
		}

		this.init();
	}

	_getIdFromUrl() {

		let queryParamFromUrl = null;

		if (window.location.href.indexOf("?") > -1) {
			queryParamFromUrl = window.location.href.slice(
				window.location.href.indexOf("?") + 1
			);
		}

		console.log("UUID IN URL:", queryParamFromUrl);

		if (!queryParamFromUrl) {
			throw new Error("no id in url found!")
		}

		this.serverConnQuery = queryParamFromUrl;
	}

	_sendMsgToSrv(e) {

		e.preventDefault();

		const fileName = e.target.value.substr(e.target.value.lastIndexOf("\\") + 1);

		if (fileName) {

			this.shadows.publish(this.serverConnQuery,
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
					<h1>Sofa Kongs</h1>

					{
						this.props.showSessionLink ?
							<div>
								<img id="qrCode" src={this.state.qrImgSrc}/>

								<a id="sessionLink"
								   href={this.state.sessionLink}>
									Session Link
								</a>
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
