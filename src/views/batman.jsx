import React from "react";
import ReactDOM from "react-dom";
import SessionSharing from "../components/session-sharing.jsx";

ReactDOM.render(
	<SessionSharing showSessionLink={false} evaluateQueryString={true}/>,
	document.getElementById("root")
);
