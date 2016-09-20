import React from "react";

export default class bla extends React.Component {

	static propTypes = {
		fileName: React.PropTypes.string
	};

	render() {
		return (
			<li id="soi-file-1">
				<div
					className="file-upload-list truncate-flex-parent relative pv-small">

					<span className="text-with-icon
			                                        text-with-icon--narrow
			                                        text-with-icon--large
			                                        truncate-long-and-truncated-with-child-corrected text-with-icon--pdf">
						<span>{this.props.fileName}</span>
					</span>

					<div className="pl-tiny truncate-short-and-fixed">
						<span >
							<a href="#"
							   className="text-with-icon text-with-icon--error text-with-icon--trash text-with-icon--narrow no-carpet weight-normal">
								entfernen
							</a>
						</span>
					</div>

				</div>
			</li>
		);
	}
}