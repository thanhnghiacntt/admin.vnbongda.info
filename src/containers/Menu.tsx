import * as React from "react";
import { NavLink } from "react-router-dom";
import { AppStore } from "../redux/AppStore";
import {Authentication} from "../helpers/Authentication";

export interface MenuProps {

}

export interface MenuState {

}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class Menu extends React.Component<MenuProps, MenuState> {

  strings = AppStore.getState().strings;

  render() {
    return (
      <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
        <li className="nav-item active">
          <NavLink exact activeClassName="active" className="nav-link" to="/"><i className="fa fa-home"></i>{this.strings.home}</NavLink>
        </li>
        <li className="nav-item">
          <NavLink exact activeClassName="active" className="nav-link" to="/category"><i className="fa fa-category"></i>{this.strings.category}</NavLink>
        </li>
        <li className="nav-item">
          <NavLink exact activeClassName="active" className="nav-link" to="/post"><i className="fa fa-search-minus"></i>{this.strings.post}</NavLink>
        </li>
        <li className="nav-item">
          {
            Authentication.isLogin() ?
              null:
              <NavLink exact activeClassName="active" className="nav-link" to="/login"><i className="fa fa-sign-in"></i>{this.strings.signin}</NavLink>
          }
        </li>
      </ul>
    )
  }

  logout(){
    Authentication.logout();
    this.setState({});
  }
}