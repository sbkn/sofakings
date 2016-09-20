import React from "react";
import SessionSharingBase from "./session-sharing-base.jsx";
import uuid from "uuid";
import FileInfo from "./FileInfo.jsx";
import qrCode from "qrcode-npm";

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

		this.qrImgSrc = SessionSharing._getQRCodeSrc(
			window.location.href + "?" + this.sessionId
		);

		this.init();
	}

	static _getQRCodeSrc(url) {

		const qr = qrCode.qrcode(10, "M");

		qr.addData(url);
		qr.make();

		const qrImg = qr.createImgTag(4);
		const foo = qrImg.substr(qrImg.indexOf("\"") + 1);
		return foo.substr(0, foo.indexOf("\""));
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
											<div
												className="form-row form-row--halves">
												<div className="form-row__item">
													<img id="qrCode"
														 src={this.state.qrImgSrc}/>
												</div>
												<div className="form-row__item">
													<a id="sessionLink"
													   target="_blank"
													   href={"batman.html?" + this.sessionId}>
														Session Link
													</a>
													<p>{this.sessionId}</p>
												</div>
											</div>
											: null
									}

									<div className="form-row__inputs mb">
										<div className="form-row__item">
											<div>
												<div
													className="icon-teaser-box mb-small"
													id="dropzone">
													<div
														className="icon-teaser-box__icon text-center col-3/12 col-1/1@m">
														<i className="icon icon--upload-outline"/>
													</div>
													<div
														className="col-9/12 col-1/1@m">
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
										<div
											className="form-row__item form-row__item--tooltip">
											<p className="form-tooltip info-box js-form-tooltip mb@s">
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

												<FileInfo/>

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
