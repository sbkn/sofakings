import React from "react";

export default class App extends React.Component {

	static propTypes = {
		pageTitle: React.PropTypes.string
	};

	static defaultProps = {
		pageTitle: "Boilerplate"
	};

	constructor(props) {

		super(props);

		this._handleSomething = this._handleSomething.bind(this);
	}

	_handleSomething() {
	}

	render() {

		return (
			<p>{this.props.pageTitle}</p>
		);

	}
}
