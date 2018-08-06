import * as React from "react";
import {Route, Redirect} from "react-router";
import {Component} from "react";
import {Authentication} from "./Authentication";

export const AuthorizeRoute = ({ component: Component, ...rest }: any) => (
  <Route {...rest} render={props => (
    Authentication.isAdministrator() ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

