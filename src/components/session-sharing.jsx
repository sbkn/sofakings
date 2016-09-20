import React from "react";
import uuid from "uuid";
import SessionSharingBase from "./session-sharing-base.jsx";
import FileInfo from "./FileInfo.jsx";
import SessionLink from "./SessionLink.jsx";

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
		this._rotateSessionId = this._rotateSessionId.bind(this);

		let currentUuid;

		if (this.props.evaluateQueryString) {
			currentUuid = this._getSessionIdFromUrl();
		} else {
			currentUuid = uuid.v4();
		}

		this.state.sessionId = currentUuid;

		window.setInterval(this._rotateSessionId, 10 * 1000);

		this.init();
	}

	_rotateSessionId() {

		if (!this.state.established) {

			console.log("setting new session id");

			this.setState({
				sessionId: uuid.v4()
			});
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

	_sendMsgToSrv(e) {

		e.preventDefault();

		const fileName = e.target.value.substr(e.target.value.lastIndexOf("\\") + 1);

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

		}

		return true;
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
															onChange={this._sendMsgToSrv}
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
