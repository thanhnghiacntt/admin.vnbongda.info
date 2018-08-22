import * as React from "react";
import { NavBar } from './NavBar'
import { UserService } from "../services/UserService";
import { Component } from "react";
import { Redirect } from "react-router";
import "../../data/scss/style.scss";
import { AppEvent, AppStore } from "../redux/AppStore";
import {Unsubscribe} from "redux";
import {Authentication} from "../helpers/Authentication";

export interface LayoutProps {
}

export interface LayoutState {
}

export class Layout extends Component<LayoutProps, LayoutState> {

  redirect = false;
  redirectTo: string;
  unsubscribe: Unsubscribe;

  constructor(props: LayoutProps) {
    super(props);
  }

  componentDidMount(){
    this.unsubscribe = AppStore.subscribe(state => {
      if (state.event == AppEvent.redirect){
        this.redirect = true;
        this.redirectTo = state.targetRoute;
        this.setState({});
      }
    })
  }

  logout = () => {
    Authentication.logout();
    this.redirect = true;
    AppStore.postEvent(AppEvent.logout, false);
    this.setState({})
  };

  render() {
    if(this.redirect){
      this.redirect = false;
      return <Redirect to={this.redirectTo} />
    }
    return (
      <div>
        <NavBar onLogOut={this.logout} />
        <div className="container clearfix">
          <div className="distance"></div>
          {this.props.children}
        </div>
      </div>)
  }
}

