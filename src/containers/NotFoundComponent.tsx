import * as React from "react";
import {Link} from "react-router-dom";

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.

export class NotFoundComponent extends React.Component<{}, {}> {
  render() {
    return <div>
      The requested URL {window.location.host + window.location.pathname + window.location.hash} was not found on this server.
      <div><Link to="/">Return Home Page</Link></div>
    </div>
  }
}