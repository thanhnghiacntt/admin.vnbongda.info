import * as React from "react";
import { match } from "react-router";
import * as Resource from "../Language"
import { AppStore, AppEvent } from "../redux/AppStore";
import {Helper} from "../helpers/Helper";
import {UserService} from "../services/UserService";
import {User} from "../models/User";
export interface Props {
}

export interface State{
  errorMessage?: string;
  user?: User
}

/**
 * Sign up
 */
export class SignUp extends React.Component<Props, State> {

  strings = AppStore.getState().strings;
  userService = new UserService();
  state: State = {
    errorMessage: null,
    user: new User()
  };

  /**
   * Did mount component
   */
  componentDidMount() {
  }

  /**
   * Render html
   * @returns {any}
   */
  render() {
    return <div className="form-horizontal" role="form" >
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <h2>{this.strings.newregister}</h2>
          <hr/>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 field-label-responsive">
          <label htmlFor="name">{this.strings.fullname}</label>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <div className="input-group mb-2 mr-sm-2 mb-sm-0">
              <div className="input-group-addon" style={{width:"2.6rem"}}><i className="fa fa-user"></i></div>
              <input type="text" className="form-control"
                     placeholder={this.strings.firstname}
                     value={this.state.user.firstName}
                     onChange={(event) => {this.state.user.firstName = event.target.value; this.setState({})}}/>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <div className="input-group mb-2 mr-sm-2 mb-sm-0">
              <div className="input-group-addon" style={{width:"2.6rem"}}></div>
              <input type="text"className="form-control"
                     placeholder={this.strings.lastname}
                     value={this.state.user.lastName}
                     onChange={(event) => {this.state.user.lastName = event.target.value; this.setState({})}}/>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-control-feedback">
            <span className="text-danger align-middle"/>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 field-label-responsive">
          <label htmlFor="name">{this.strings.username}</label>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <div className="input-group mb-2 mr-sm-2 mb-sm-0">
              <div className="input-group-addon" style={{width:"2.6rem"}}><i className="fa fa-user-plus"></i></div>
              <input type="text" className="form-control"
                     value={this.state.user.username}
                     onChange={(event) => {this.state.user.username = event.target.value; this.setState({})}}
                     placeholder={this.strings.placeholderusername}/>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-control-feedback">
            <span className="text-danger align-middle"/>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 field-label-responsive">
          <label htmlFor="email">{this.strings.email}</label>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <div className="input-group mb-2 mr-sm-2 mb-sm-0">
              <div className="input-group-addon" style={{width:"2.6rem"}}><i className="fa fa-at"></i></div>
              <input type="text" className="form-control"
                     value={this.state.user.email}
                     onChange={(event) => {this.state.user.email = event.target.value; this.setState({})}}
                     placeholder={this.strings.placeholderemail}/>
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
        <div className="col-md-3 field-label-responsive">
          <label htmlFor="password">{this.strings.password}</label>
        </div>
        <div className="col-md-6">
          <div className="form-group has-danger">
            <div className="input-group mb-2 mr-sm-2 mb-sm-0">
              <div className="input-group-addon" style={{width:"2.6rem"}}><i className="fa fa-key"></i></div>
              <input type="password" className="form-control"
                     value={this.state.user.password}
                     onChange={(event) => {this.state.user.password = event.target.value; this.setState({})}}
                     placeholder={this.strings.password}/>
            </div>
          </div>
        </div>
        <div className="col-md-3">
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 field-label-responsive">
          <label htmlFor="password">{this.strings.confirmpassword}</label>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <div className="input-group mb-2 mr-sm-2 mb-sm-0">
              <div className="input-group-addon" style={{width:"2.6rem"}}>
                <i className="fa fa-repeat"></i>
              </div>
              <input type="password" className="form-control"
                     value={this.state.user.confirmPassword}
                     onChange={(event) => {this.state.user.confirmPassword = event.target.value; this.setState({})}}
                     placeholder={this.strings.password}/>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-success" onClick={()=>this.register()}><i className="fa fa-user-plus"></i>{this.strings.register}</button>
        </div>
        <div className="col-md-4">
          {
            this.state.errorMessage != null && this.state.errorMessage.length > 0 ?
              <div className="form-control-feedback">
                <span className="text-danger align-middle">
                  <i className="fa fa-close">{this.state.errorMessage}</i></span>
              </div>: null
          }
        </div>
      </div>
    </div>
  }

  /**
   * Register
   */
  register(){
    this.state.user.role = "User";
    if(Helper.isEmpty(this.state.user.firstName)){
      this.setState({errorMessage: this.strings.firstnameempty})
    }else if(Helper.isEmpty(this.state.user.lastName)){
      this.setState({errorMessage: this.strings.lastnameempty})
    }else if(Helper.isEmpty(this.state.user.username)){
      this.setState({errorMessage: this.strings.usernameempty})
    }else if(Helper.isEmpty(this.state.user.email)){
      this.setState({errorMessage: this.strings.emailempty})
    }else if(Helper.isEmpty(this.state.user.password)){
      this.setState({errorMessage: this.strings.passwordempty})
    }else if(Helper.isEmpty(this.state.user.confirmPassword)){
      this.setState({errorMessage: this.strings.confirmpasswordempty})
    } else if(this.state.user.confirmPassword != this.state.user.password){
      this.setState({errorMessage: this.strings.confirmpasswordincorect})
    }else{
      this.userService.register(this.state.user, (data: any)=>{
        if(data.code == "success") {
          Helper.navigateTo("/signin");
        } else {
          this.setState({errorMessage: data.message});
        }
      });
    }
  }
}