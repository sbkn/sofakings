import React from "react";
import uuid from "uuid";
import SessionSharingBase from "./session-sharing-base.jsx";
import FileInfo from "./FileInfo.jsx";
import SessionLink from "./SessionLink.jsx";
import apigClientFactory from "../../libs/api-client-loader.es6";

export default class SessionSharing extends SessionSharingBase {

	static propTypes = {
		evaluateQueryString: React.PropTypes.bool,
		showSessionLink: React.PropTypes.bool
	};

	state = {
		docs: []
	};

	constructor(props) {

		super(props);

		this._sendMsgToSrv = this._sendMsgToSrv.bind(this);
		this.handleUploadFile = this.handleUploadFile.bind(this);
		this._rotateSessionId = this._rotateSessionId.bind(this);

		let currentUuid;

		if (this.props.evaluateQueryString) {
			currentUuid = this._getSessionIdFromUrl();
		} else {
			currentUuid = uuid.v4();
		}

		this.state.sessionId = currentUuid;

		//window.setInterval(this._rotateSessionId, 10 * 1000);

		this.init();
	}

	_rotateSessionId() {

		if (!this.state.established) {

			const id = uuid.v4();
			console.log("setting new session id", id);

			this.setState({
				sessionId: id
			});

			this.init();
		}

	}

	componentDidMount() {
		this.setState({
			qrImgSrc: this.qrImgSrc
		});
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

		return uuid;
	}

	handleUploadFile(event) {

		this.getFileFromInput(event.target);
	}

	_sendMsgToSrv(e) {

		e.preventDefault();

		//const fileName = e.target.value.substr(e.target.value.lastIndexOf("\\") + 1);
		const fileName = e;

		if (fileName) {

			this.shadows.publish(this.state.sessionId,
				JSON.stringify({
					fileName
				}),
				{},
				(err, data) => {
					if (err) throw err;

					console.log(err, data);
				});

			e.target.value = "";
		}

		return true;
	}

	getFileFromInput(fileInputRef) {

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

	_handleFileUpload(fileAsBase64/*, fileName*/) {

		const apigClient = apigClientFactory.newClient({
			apiKey: "XisfDenhRE8OhMB4dHnkH2rBYSDR1XtC3sLkYnR0"
		});

		const fileToUploadAsBase64 = fileAsBase64.substr(fileAsBase64.indexOf(",") + 1);

		const request = {
			sessionId: this.state.sessionId,
			data: fileToUploadAsBase64
		};

		return apigClient.updownerPut({}, request, {})
			.then(result => {

				console.log(result);
				this._sendMsgToSrv();
			})
			.catch(err => {

				console.error(err);
			});
	}

	_handleMessage(name, state) {

		console.log("msg", name);

		if (name === this.state.sessionId + "-established") {

			this.setState({
				established: true,
				platform: state.platform
			});
		}
		else {
			const docs = [...this.state.docs];

			docs.push({
				fileName: state.fileName
			});

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
												<span>Einkommensnachweis hochladen</span>
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
															onChange={this.handleUploadFile}
															id="incomeproof"
															accept="application/pdf, image/tiff, image/jpeg"
															type="file"
															className="btn btn--secondary"/>

													</div>
												</div>
											</div>
										</div>
										<div className="form-row__item
										form-row__item--tooltip">

											<p className="form-tooltip
											info-box
											js-form-tooltip mb@s">
												Es können bis zu drei
												Dateien
												vom
												Typ
												JPG,
												PDF und
												TIFF mit einer Größe von bis
												zu
												4,5
												MB
												hochgeladen werden.</p>
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

}
