import React from "react";
import qrCode from "qrcode-npm";

export default class SessionLink extends React.Component {

	static propTypes = {
		sessionId: React.PropTypes.string,
		established: React.PropTypes.bool,
		platform: React.PropTypes.string
	};

	static _getQRCodeSrc(url) {

		const qr = qrCode.qrcode(10, "M");

		qr.addData(url);
		qr.make();

		const qrImg = qr.createImgTag(4);
		const foo = qrImg.substr(qrImg.indexOf("\"") + 1);
		return foo.substr(0, foo.indexOf("\""));
	}

	constructor(props) {
		super(props);

		this.link = "http://" + window.location.host + "/batman.html?" + this.props.sessionId;

		this.qrImgSrc = SessionLink._getQRCodeSrc(this.link);
	}

	render() {

		return (
			<div className="form-row form-row--halves">
				<div className="form-row__item">
					<img id="qrCode" src={this.qrImgSrc}/>
				</div>
				<div className="form-row__item">
					<a id="sessionLink" target="_blank"
					   href={this.link}>
						Open Sender
					</a>
					<div>
						SessionId:<br/>
						{this.props.sessionId}

						{
							this.props.established ?
								<div>
									<div
										className="icon-teaser-box__icon text-center col-1/12 col-1/1@m">
										<i className="icon icon--checkmark"/>
									</div>
									<div>
										{this.props.platform}
									</div>
								</div>
								: null
						}
					</div>
				</div>
			</div>
		);
	}
}