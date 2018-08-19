import * as React from "react";
import { Unsubscribe } from "redux"
import { UserService } from "../services/UserService";
import { AppEvent, AppStore, Language } from "../redux/AppStore";
import { BrowserRouter as Router, Redirect, NavLink, Link } from 'react-router-dom';
import { Nav, NavItem, NavDropdown, MenuItem, Dropdown } from 'react-bootstrap';
import {NavbarContaint} from "./NavbarContaint";
export interface NavBarProps {
  onLogOut?: Function
  changeLanguage?: Function
  history?: any;
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class NavBar extends React.Component<any, {}> {

  redirect = false;
  redirectLink = "";

  constructor(props: any) {
    super(props)
  }

  strings = AppStore.getState().strings;

  render() {
    if (this.redirect) {
      this.redirect = false;
      return (<Redirect to={this.redirectLink} />)
    }
    let lang = UserService.shared.getLanguage()
    return (
      <div className="navbar navbar-dark bg-primary">
        <NavbarContaint/>
      </div>
    )
  }
}