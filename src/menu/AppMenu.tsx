/**
 * Created by banhtieu on 8/29/2016.
 */
import * as React from "react";
import Menu from './Menu';
import Item from './Item';
import {Unsubscribe} from "redux";
import appStore from "../application/stores/AppStore";

interface AppMenuState {
  collapsed?: boolean
}


/**
 * app menu component
 */
export default class AppMenu extends React.Component<{}, AppMenuState> {

  /**
   * the default state
   * @type {any}
   */
  state = {
    collapsed: appStore.getState().collapsed
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
        collapsed: appStore.getState().collapsed
      })
    )
  }

  /**
   * component will unmount
   */
  componentWillUnmount() {
    this.unsubscribe();
  }

  /**
   * render the app menu
   * @returns {any}
   */
  render() {
    return (

      <div id="app-menu" className={this.state.collapsed ? "collapsed" : ""}>
        <div className="welcome">
          <img style={{width:"60px"}} src="/data/deki-icon.png" className="ui avatar tiny image image"/>
        </div>
        <Menu>
          <Item text="Home" linkTo="/dashboard" hasSubMenu={true} icon="home icon">
          </Item>
          <Item text="Users" linkTo="/users" icon="user icon">

          </Item>
          <Item linkTo="/settings" text="Settings" icon="setting icon">
          </Item>
          <Item hasSubMenu={true} linkTo="/category" text="Category" icon="list layout icon">
          </Item>
        </Menu>
      </div>
    );
  }
}
