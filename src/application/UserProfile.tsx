/**
 * Created by Admin on 10/17/2016.
 */


import * as React from 'react';
import {Helper} from "../utils/Helper";
import {browserHistory, Redirect} from "react-router";
import {Authentication} from "../utils/Authentication";

interface UserProfileSate {
  showMenu: boolean;
}

/**
 * the not found page
 */
export default class UserProfile extends React.Component<{}, UserProfileSate> {

  /**
   * init state
   * @type {{showMenu: boolean}}
   */
  state: UserProfileSate = {
    showMenu: false
  };

  showMenu: boolean;

  redirectProfile = false
  redirectToLogin = false

  constructor() {
    super();
    this.showMenu = false;
  }

  /**
   * component did mount
   */
  componentDidMount() {
  }

  /**
   * render the components
   * @returns {XML}
   */
  render() {
    if (this.redirectProfile){
      this.redirectProfile = false
      return (<Redirect to="/profile"/>)
    }
    if (this.redirectToLogin){
      this.redirectToLogin = false
      return (<Redirect to="/login"/>)
    }
    return (
      <div className="user-profile" onMouseLeave={()=>{this.setState({showMenu:false})}}>
        <div className={"profile-pic "+(this.state.showMenu? "" : "collapsed")}
             onClick={()=>{this.showMenu=!this.state.showMenu;this.setState({showMenu:this.showMenu});}}>
          <img width={45} height={45} style={{display:"inline"}} alt="" className="ui circular image"
               src={Authentication.getAvatar() != null ? Authentication.getAvatar() :"/data/avatar.png"}/>
          <span style={{padding:"0px 10px 0px 10px"}} className="username ui circular image">
            {Authentication.getName()!= null ? Authentication.getName() : "Admin"} </span>
          <i className="chevron down icon"/>
        </div>
        <ul className={"profile-menu ui vertical menu "+(this.state.showMenu? "" : "collapsed")}>
          <li className="item"
              onClick={()=> { this.redirectProfile = true; this.setState({})}}
          >
            <a href="#">
              <i className="icon user"/> View Profiles</a>
          </li>
          <li className="item" onClick={()=> {Authentication.logout(); this.redirectToLogin = true; this.setState({}) }}>
            <a href="#">
              <i className="icon power"/> Log Out </a>
          </li>
        </ul>
      </div>
    );
  }
}
