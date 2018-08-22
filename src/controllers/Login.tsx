import * as React from "react";
import { match } from "react-router";
import { AppStore, AppEvent } from "../redux/AppStore";
import {UserService} from "../services/UserService";
import {Helper} from "../helpers/Helper";
import {Authentication} from "../helpers/Authentication";
export interface Props {
  match: match<any>
}

export interface StateLogin {
  errorMessage?: string;
  username?: string;
  password?: string;
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class Login extends React.Component<Props, StateLogin> {

  userService = new UserService();
  strings = AppStore.getState().strings;
  state: StateLogin = {
    errorMessage: null,
    username: "",
    password: ""
  };


  componentDidMount() {
    AppStore.postEvent(AppEvent.changePageTitle, this.props.match.path);
  }

  render() {
    return <div>
      <div className="form-horizontal">
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <h2>{this.strings.pleaselogin}</h2>
            <hr/>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3"><label htmlFor="name">{this.strings.username}</label></div>
          <div className="col-md-6">
            <div className="form-group has-danger">
              <label className="sr-only" htmlFor="email">{this.strings.username}</label>
              <div className="input-group mb-2 mr-sm-2 mb-sm-0">
                <div className="input-group-addon"
                     style={{width: "2.6rem"}}><i className="fa fa-user"></i></div>
                <input type="text" name="email"
                       className="form-control"
                       value={this.state.username}
                       onChange={(event) => {this.setState({username:event.target.value})}}
                       id="email"
                       placeholder={this.strings.placeholderusername} required={true} autoFocus={true}/>
              </div>
            </div>
          </div>
          <div className="col-md-3">
          </div>
        </div>
        <div className="row">
          <div className="col-md-3"><label htmlFor="name">{this.strings.password}</label></div>
          <div className="col-md-6" style={{paddingTop: ".35rem"}}>
            <div className="form-group">
              <label className="sr-only" htmlFor="password">Password</label>
              <div className="input-group mb-2 mr-sm-2 mb-sm-0">
                <div className="input-group-addon" style={{width: "2.6rem"}}><i className="fa fa-key"></i></div>
                <input type="password" name="password"
                       className="form-control" id="password"
                       value={this.state.password}
                       onChange={(event) => {this.setState({password:event.target.value})}}
                       placeholder={this.strings.password} required={true}/>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-control-feedback">
              <span className="text-danger align-middle"></span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-6" style={{paddingTop: ".35rem"}}>
            <div className="form-check mb-2 mr-sm-2 mb-sm-0">
              <label className="form-check-label">
                <input className="form-check-input" name="remember"
                       type="checkbox" />
                  <span style={{paddingBottom: ".15rem"}}>{this.strings.remember}</span>
              </label>
            </div>
          </div>
        </div>
        <div className="row" style={{paddingTop: "1rem"}}>
          <div className="col-md-3"></div>
          <div className="col-md-4">
            <button type="submit" className="btn btn-success" onClick={()=>this.login()}><i className="fa fa-sign-in"></i>{this.strings.login}</button>
            <a className="btn btn-link" href="/password/reset">{this.strings.forgetpassword}</a>
          </div>
          <div className="col-md-5">
            <div className="form-control-feedback">
              {
                this.state.errorMessage != null ?
                  <span className="text-danger align-middle">
                  <i className="fa fa-close"></i> {this.state.errorMessage}
                </span>: null
              }

            </div>
          </div>
        </div>
      </div>
    </div>
  }

  /**
   * Login
   */
  login(){
    this.userService.login(this.state.username, this.state.password, (data)=> {
      if(data.code == "success"){
        Authentication.save(data.data);
        Helper.navigateTo("/");
      }else{
        this.setState({errorMessage: data.message});
      }
    });
  }
}