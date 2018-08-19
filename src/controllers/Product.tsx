import * as React from "react";
import { match } from "react-router";
import * as Resource from "../Language"
import { AppStore, AppEvent } from "../redux/AppStore";
export interface Props {
  match: match<any>
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class Product extends React.Component<Props, {}> {

  strings = AppStore.getState().strings;

  componentDidMount() {
    AppStore.postEvent(AppEvent.changePageTitle, this.props.match.path);
  }

  render() {
    return <h1>Product</h1>;
  }
}