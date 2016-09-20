import React from "react";
import uuid from "uuid";
import SessionSharingBase from "./session-sharing-base.jsx";
import FileInfo from "./FileInfo.jsx";
import SessionLink from "./SessionLink.jsx";
import apigClientFactory from "../api-client-loader.es6";

export default class SessionSharing extends SessionSharingBase {

	static propTypes = {
		evaluateQueryString: React.PropTypes.bool,
		showSessionLink: React.PropTypes.bool,
		pageTitle: React.PropTypes.string
	};

	static defaultProps = {
		evaluateQueryString: false,
		showSessionLink: true,
		pageTitle: "Einkommensnachweis hochladen"
	};

	state = {
		docs: []
	};

	constructor(props) {

		super(props);

		this._sendMsgToSrv = this._sendMsgToSrv.bind(this);
		this._handleUploadFile = this._handleUploadFile.bind(this);

		let currentUuid;

		if (this.props.evaluateQueryString) {
			currentUuid = SessionSharing._getSessionIdFromUrl();
		} else {
			currentUuid = uuid.v4();
		}

		this.state.sessionId = currentUuid;

		this.init();
	}

	componentDidMount() {
		this.setState({
			qrImgSrc: this.qrImgSrc
		});
	}

	static _getSessionIdFromUrl() {

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

		return uuid;
	}

	_handleUploadFile(event) {

		this._getFileFromInput(event.target);
	}

	_sendMsgToSrv(frontEndFileId, upDownerResponse) {

		upDownerResponse.frontEndFileId = frontEndFileId;

		this.shadows.publish(this.state.sessionId,
			JSON.stringify(upDownerResponse),
			{},
			(err, data) => {
				if (err) throw err;

				console.log(err, data);
			});

		return true;
	}

	_getFileFromInput(fileInputRef) {

		const fileName = fileInputRef.value.substr(fileInputRef.value.lastIndexOf("\\") + 1);
		const file = fileInputRef.files[0];

		this._readFile(fileName, file);

		fileInputRef.value = null;
	}

	_readFile(fileName, file) {

		if (file) {

			const fileReader = new FileReader();

			fileReader.onload = () => {

				this._handleFileUpload(fileReader.result, fileName);
			};

			fileReader.onerror = () => {

				console.error("file could not be read from fs!");
			};

			fileReader.readAsDataURL(file);
		}
	}

	_handleFileUpload(fileAsBase64, fileName) {

		const apigClient = apigClientFactory.newClient({
			apiKey: "XisfDenhRE8OhMB4dHnkH2rBYSDR1XtC3sLkYnR0"
		});

		const fileToUploadAsBase64 = fileAsBase64.substr(fileAsBase64.indexOf(",") + 1);
		const frontEndFileId = uuid.v4();

		this._addFileToList(fileName, frontEndFileId);
		this._sendMsgToSrv(frontEndFileId, {fileName});

		const request = {
			sessionId: this.state.sessionId,
			data: fileToUploadAsBase64
		};

		return apigClient.updownerPut({}, request, {})
			.then(result => {

				console.log("UpDowner response", result.data);
				this._sendMsgToSrv(frontEndFileId, result.data);
			})
			.catch(err => {

				console.error(err);
			});
	}

	_handleMessage(name, state) {

		console.log("Received msg over IoT:");
		console.log("name", name);
		console.log("state", state);

		if (name === this.state.sessionId + "-established") {

			this.setState({
				established: true,
				platform: state.platform
			});
		}
		else {
			const docs = [...this.state.docs];

			const obj = docs.filter(obj => {
				return obj.frontEndFileId === state.frontEndFileId;
			})[0];

			if (obj) {
				state.fileName = obj.fileName;
				docs.splice(docs.indexOf(obj), 1);
			}
			docs.push(state);

			this.setState({
				docs
			});
		}
	}

	render() {

		return (
			<div className="root">
				<main>
					<div className="page-wrap">
						<div
							className="js-step-container content-wrap bg-neutral"
							id="page-personal">
							<form>

								<fieldset
									className="form-row form-row--whole">
									<div className="form-row__labels mb">
										<div className="form-row__item">
											<strong>
												<span>{ this.props.pageTitle }</span>
											</strong>
											<p className="mb-none">Für die
												Einrichtung
												eines
												Dispositionskredites und
												Verfügungsrahmens
												zur VISA Card pur benötigen
												wir
												von
												Ihnen
												einen aktuellen
												Einkommensnachweis
												(z.B.
												die
												letzte Gehaltsabrechnung).
												Den
												Einkommensnachweis können
												Sie
												direkt
												hier
												hochladen.</p>
										</div>
									</div>

									{
										this.props.showSessionLink ?
											<SessionLink
												established={this.state.established}
												platform={this.state.platform}
												sessionId={this.state.sessionId}/>
											: null
									}

									<div className="form-row__inputs mb">
										<div className="form-row__item">
											<div>
												<div className="icon-teaser-box
												mb-small"
													 id="dropzone">
													<div className="icon-teaser-box__icon
														text-center
														col-3/12
														col-1/1@m">

														<i className="icon icon--upload-outline"/>
													</div>
													<div className="col-9/12
													col-1/1@m">
														<div
															className="icon-teaser-box__text">

															<p>Datei zum
																Hochladen
																auswählen.</p>

														</div>

														<label
															htmlFor="incomeproof"
															id="uploadbutton"
															className="btn btn--secondary"
															style={{minWidth: 167}}>
															Datei hochladen
														</label>

														<input
															style={{display: "none"}}
															onChange={this._handleUploadFile}
															id="incomeproof"
															accept="application/pdf, image/tiff, image/jpeg"
															type="file"
															className="btn btn--secondary"/>

													</div>
												</div>
											</div>
										</div>

										<div className="form-row__item">
											<ul id="msgList"
												className="list-bare">

												{
													this.state.docs.map(doc => {
														return <FileInfo
															key={Math.random().toString()}
															fileName={doc.fileName}/>
													})
												}

											</ul>
										</div>

									</div>
								</fieldset>

							</form>
						</div>
					</div>
				</main>
			</div>

		);

	}

	_addFileToList(fileName, frontEndFileId) {

		const docs = [...this.state.docs];

		docs.push({
			fileName,
			frontEndFileId
		});

		this.setState({
			docs
		});
	}
}
