import * as React from "react";
import appStore, {AppEvent, postEvent} from "./stores/AppStore";
import  UserProfile from "./UserProfile"
import {Unsubscribe} from "redux";

interface NavigationBarState {
  collapsed?: boolean,
  title?: string
}
/**
 * the navigation bar
 */
class NavigationBar extends React.Component<{}, NavigationBarState> {

  state: NavigationBarState = {
    collapsed: false,
    title: "Dashboard"
  };
  /**
   * the subscription
   */
  unsubscribe: Unsubscribe;

  /**
   * the component did mount
   */
  componentDidMount() {

    this.unsubscribe = appStore.subscribe(
      () => this.setState({
        collapsed: appStore.getState().collapsed,
        title: appStore.getState().title
      })
    )
  }

  /**
   * toggle menu clicked
   */
  toggleMenuClicked() {
    //noinspection TypeScriptValidateTypes
    postEvent(AppEvent.Toggle, true)
    this.setState({collapsed: appStore.getState().collapsed});
  }

  /**
   * Render the component
   * @returns {any}
   */
  render() {
    return (
      <div id="top-bar" className="ui top fixed menu"
           style={{paddingLeft:!this.state.collapsed?"250px": "60px"}}>
        <div className="top-bar-container">
          <a className="toggle-icon" onClick={event => this.toggleMenuClicked()}>
            <i className="content icon"/>
          </a>
          <h3 style={{marginTop: '20px', marginLeft: '55px', display: 'inline-block'}}>{
            this.state.title
          }</h3>
          <UserProfile/>
        </div>
      </div>
    );
  }
}

export default NavigationBar;