import * as React from "react";
import { match } from "react-router";
import * as Resource from "../Language"
import { AppStore, AppEvent } from "../redux/AppStore";
export interface HomeProps {
  match: match<any>
}

export class AdminGallery extends React.Component<HomeProps, {}> {

  strings = AppStore.getState().strings;

  componentDidMount() {
    AppStore.postEvent(AppEvent.changePageTitle, this.props.match.path);
  }

  render() {
    return <h1>AdminGallery</h1>;
  }
}