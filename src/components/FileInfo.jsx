import React from "react";

export default class FileInfo extends React.Component {

	static propTypes = {
		fileName: React.PropTypes.string,
		fileId: React.PropTypes.string,
		frontEndFileId: React.PropTypes.string,
		deleteHandler: React.PropTypes.func
	};

	static defaultProps = {
		fileName: "UNNAMED FILE",
		fileId: null,
		frontEndFileId: null,
		deleteHandler: null
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
					</div>

				</div>
			</li>
		);
	}
}