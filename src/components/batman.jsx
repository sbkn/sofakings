import React, {Component} from "react";
import SessionSharing from "./session-sharing.jsx";

export default class Batman extends Component {

	render() {
		return (
			<SessionSharing showSessionLink={false} evaluateQueryString={true}/>
		);
	}
}
