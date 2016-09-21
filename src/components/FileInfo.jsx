import React from "react";

export default class FileInfo extends React.Component {

	static propTypes = {
		fileName: React.PropTypes.string,
		fileId: React.PropTypes.string,
		s3Link: React.PropTypes.string,
		frontEndFileId: React.PropTypes.string,
		deleteHandler: React.PropTypes.func,
		hasBeenProcessed: React.PropTypes.bool
	};

	static defaultProps = {
		fileName: "UNNAMED FILE",
		fileId: null,
		s3Link: "#",
		frontEndFileId: null,
		deleteHandler: null,
		hasBeenProcessed: false
	};

	constructor(props) {

		super(props);
		this._onDeleteClicked = this._onDeleteClicked.bind(this);

	}

	_onDeleteClicked() {

		if (this.props.deleteHandler) {
			this.props.deleteHandler(this.props.fileId, this.props.frontEndFileId);
		}
	}

	render() {
		return (
			<li>
				<div
					className="file-upload-list truncate-flex-parent relative pv-small">

					<span className="text-with-icon
									 text-with-icon--narrow
									 text-with-icon--large
									 truncate-long-and-truncated-with-child-corrected
									 text-with-icon--pdf">

						<span>{this.props.fileName}</span>
					</span>

					<div className="pl-tiny truncate-short-and-fixed">
						<span >
							{
								this.props.hasBeenProcessed ?
									<span>
										<a href={this.props.s3Link}
										   target="_blank"
										   className="text-with-icon
										   text-with-icon--magniglas
										   text-with-icon--brand
										   text-with-icon--narrow
										   no-carpet
										   weight-normal">
											anzeigen
										</a>

										<a href="#"
										   onClick={this._onDeleteClicked}
										   className="text-with-icon
										   text-with-icon--error
										   text-with-icon--trash
										   text-with-icon--narrow
										   no-carpet
										   weight-normal">

											entfernen
										</a>
									</span>
									: null
							}
						</span>
					</div>

				</div>
			</li>
		);
	}
}