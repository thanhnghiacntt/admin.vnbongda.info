import * as React from "react";
import {Route, Redirect} from "react-router";
import {Component} from "react";
import {UserService} from "../services/UserService";
import {Authentication} from "./Authentication";


export class PrivateRoute extends Route {
  render() {
    const rest = this.props
    return Authentication.isLogin() ? (
      <Route component={ this.props.component}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: this.props.location }
      }}/>)
  }
}

export const NotAuthorizeRoute = ({ component: Component, ...rest }: any) => (
  <Route {...rest} render={props => (
    !Authentication.isLogin() ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/signin',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

