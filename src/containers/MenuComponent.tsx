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
export class MenuComponent extends React.Component<MenuProps, MenuState> {

  strings = AppStore.getState().strings;

  render() {
    return (
      <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
        <li className="nav-item active">
          <NavLink exact activeClassName="active" className="nav-link" to="/"><i className="fa fa-home"></i>{this.strings.home}</NavLink>
        </li>
        <li className="nav-item">
          <NavLink exact activeClassName="active" className="nav-link" to="/product"><i className="fa fa-product-hunt"></i>{this.strings.product}</NavLink>
        </li>
        <li className="nav-item">
          <NavLink exact activeClassName="active" className="nav-link" to="/solution"><i className="fa fa-search-minus"></i>{this.strings.solution}</NavLink>
        </li>
        <li className="nav-item">
          <NavLink exact activeClassName="active" className="nav-link" to="/document"><i className="fa fa-book"></i>{this.strings.document}</NavLink>
        </li>
        <li className="nav-item">
          <NavLink exact activeClassName="active" className="nav-link" to="/company"><i className="fa fa-address-book"></i>{this.strings.company}</NavLink>
        </li>
        <li className="nav-item">
          <NavLink exact activeClassName="active" className="nav-link" to="/price"><i className="fa fa-money"></i>{this.strings.price}</NavLink>
        </li>
        {
          Authentication.isLogin() ?
          <li className="nav-item">
            <NavLink exact activeClassName="active" className="nav-link" to="/user/keys"><i className="fa fa-key"></i>{this.strings.key}</NavLink>
          </li> : null
        }
        <li className="nav-item">
          {
            Authentication.isLogin() ?
              <NavLink exact activeClassName="active" className="nav-link" to="/signin" onClick={()=>this.logout()}><i className="fa fa-sign-out"></i>{this.strings.signout}</NavLink>:
              <NavLink exact activeClassName="active" className="nav-link" to="/signin"><i className="fa fa-sign-in"></i>{this.strings.signin}</NavLink>
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