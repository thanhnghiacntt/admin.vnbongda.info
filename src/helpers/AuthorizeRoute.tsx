import * as React from "react";
import {Route, Redirect} from "react-router";
import {Component} from "react";
import {UserService} from "../services/UserService";


export class PrivateRoute extends Route {
  render() {
    const rest = this.props
    return UserService.shared.isLoggedIn() ? (
      <Route component={ this.props.component}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: this.props.location }
      }}/>)
  }
}

export const AuthorizeRoute = ({ component: Component, ...rest }: any) => (
  <Route {...rest} render={props => (
    UserService.shared.isLoggedIn() ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/signin',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

