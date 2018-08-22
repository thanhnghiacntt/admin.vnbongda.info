import * as React from "react";
import { match } from "react-router";
import * as Resource from "../Language"
import { AppStore, AppEvent } from "../redux/AppStore";
export interface Props {
  match: match<any>
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class Setting extends React.Component<Props, {}> {

  strings = AppStore.getState().strings;

  componentDidMount() {
    AppStore.postEvent(AppEvent.changePageTitle, this.props.match.path);
  }

  render() {
    return <div>
      <div className="row">
        <div className="col-md-3">3</div>
        <div className="col-md-6">6</div>
        <div className="col-md-3">3</div>
      </div>
    </div>;
  }
}