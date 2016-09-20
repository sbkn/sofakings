import React from "react";
import qrCode from "qrcode-npm";

export default class SessionLink extends React.Component {

	static propTypes = {
		sessionId: React.PropTypes.string,
		established: React.PropTypes.bool,
		platform: React.PropTypes.string
	};

	state = {};

	constructor(props) {
		super(props);

		this.state.link = this.genLink();
	}

	static _getQRCodeSrc(url) {

		const qr = qrCode.qrcode(10, "M");

		qr.addData(url);
		qr.make();

		const qrImg = qr.createImgTag(4);
		const foo = qrImg.substr(qrImg.indexOf("\"") + 1);
		return foo.substr(0, foo.indexOf("\""));
	}

	genLink() {
		return "http://" + window.location.host + "/batman.html?" + this.props.sessionId;
	}

	componentWillReceiveProps() {

		this.setState({
			link: this.genLink()
		});
	}

	render() {

		return (
			<div className="form-row form-row--halves">
				<div className="form-row__item">
					<img id="qrCode"
						 src={SessionLink._getQRCodeSrc(this.state.link)}/>
				</div>
				<div className="form-row__item">
					<a id="sessionLink" target="_blank"
					   href={this.state.link}>
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