import * as React from "react";
import {Input} from "./Input";
import {Helper} from "../../utils/Helper";
import {Loader} from "../../common/components/loader/Loader";
import {Config} from "../../settings/Config";
import {Redirect} from "react-router";
import {Authentication} from "../../utils/Authentication";
import {Cookie} from "../../utils/Cookie";
import {Link} from "react-router-dom";

/**
 * state for login form
 */
interface LoginPageState {
  /**
   * Status login form
   */
  status?: number

  /**
   * Username
   */
  username?: string;

  /**
   * Password
   */
  password?: string;

  /**
   * Error message
   */
  errorMessage?: string;
}

const StatusForm = {
  /**
   * Display form login
   */
  LoginForm: 1,

  /**
   * Loading.tsx
   */
  Loading: 2,

  /**
   * Validate form
   */
  Validate: 3,
};

/**
 * the login form
 */
export default class LoginPage extends React.Component<any, any> {

  /**
   * initial state
   * @type {{}}
   */
  state: LoginPageState = {
    status: StatusForm.LoginForm,
    username: "",
    password: ""
  };

  constructor() {
    super();
    $(window).bind('resize', ()=>this.setState({}));
    if (!Authentication.isAuthentication()) {
      this.state.status = StatusForm.LoginForm;
    }
  }

  componentDidMount(){
    Authentication.check(() => {
      console.log(Authentication.getName())
    })
  }

  /**
   * Check role.
   */
  checkRole(data) {
    if (!Authentication.isAuthentication()) {
      this.setState({status: StatusForm.LoginForm, errorMessage: "Incorrect username or password. Please try again."})
    }
    else if (!Authentication.isAdministrator()) {
      this.setState({status: StatusForm.LoginForm, errorMessage: "You don't have permission to access."});
    }
    else {
      this.setState({})
    }
  }

  /**
   * Login
   */
  onClickLoginForm() {
    if (this.validateForm()) {
      this.setState({status: StatusForm.Loading});
      Authentication.logout();
      Authentication.login(this.state.username, this.state.password, this.checkRole.bind(this));
    } else {
      this.setState({})
    }
  }

  /**
   * Action on change username
   */
  onChangeUsername(event) {
    this.state.username = event.target.value;
  }

  /**
   * Action on change username
   */
  onChangePassword(event) {
    this.state.password = event.target.value;
  }

  /**
   * On text press
   * @param event
   */
  onKeyPress(event) {
    if (event == null || event.charCode == 13) {
      this.onClickLoginForm();
    }
  }

  /**
   * Validate form
   */
  validateForm() {
    this.state.errorMessage = "";
    let result = true;
    if ((this.state.username == null || this.state.username.length == 0) &&
      (this.state.password == null || this.state.password.length == 0)) {
      this.state.errorMessage = "Please enter username and password.";
      result = false;
    } else {
      if (this.state.username == null || this.state.username.length == 0) {
        this.state.errorMessage = "Please enter username.";
        result = false;
      }
      if (this.state.password == null || this.state.password.length == 0) {
        this.state.errorMessage += "Please enter password.";
        result = false;
      }
    }

    return result;
  }

  /**
   * Render
   * @returns {any}
   */
  render() {
    let from = { pathname: '/' };
    const state = this.props.location.state;
    if (state != null && state.from != null) {
      from = state.from
    }
    if (Authentication.isAdministrator()) {
      return <Redirect to={from} />
    }

    return <div id="login">{this.renderLoginForm()}</div>;
  }

  /**
   *
   * @param actionClick
   * @param lable
   */
  renderButton(actionClick: Function, label: string) {
    return (<div className="admin-login-logout">
      <div className="admin-ui admin-buttons">
        <button className="admin-ui admin-positive admin-button"
                onClick={(event)=> actionClick(event)}>{label}</button>
      </div>
    </div>);
  }

  /**
   * Login form
   * @returns {any}
   */
  renderLoginForm() {
    // Set position of popup to center screen
    let width = 485;
    let height = 236;
    let floatLeft = (window.innerWidth - width) / 2 >> 0;
    let floatTop = (window.innerHeight - height) / 2 >> 0;

    return (<div className="admin-login-ui">
      <Loader isLoading={this.state.status==StatusForm.Loading}/>
      <div className="admin-building-ui admin-active admin-dimmer">
        <div className="admin-login-form"
             style={{width:width+"px",height:height+"px",left:floatLeft+"px",top:floatTop+"px"}}>
          <div className="admin-header-login" style={{width:width+"px"}}>
            <div className="admin-header-content">LOGIN PAGE</div>
          </div>

          <div className="admin-content-login" style={{width:width+"px"}}>
            <div className="ui form admin-inputs">
              <div className="field"><Input type="text"
                                            className="admin-input-text"
                                            placeholder="Username or Email"
                                            autoFocus={true}
                                            onKeyPress={this.onKeyPress.bind(this)}
                                            onChange={this.onChangeUsername.bind(this)}/></div>
              <div className="field"><Input type="password"
                                            className="admin-input-text"
                                            placeholder="Password"
                                            onKeyPress={this.onKeyPress.bind(this)}
                                            onChange={this.onChangePassword.bind(this)}/></div>
              <div className="dmk-validate">
                <span>{this.state.errorMessage}</span>
              </div>
            </div>
            <div className="admin-button">
              <button className="admin-button-login" onClick={()=>this.onClickLoginForm()}>LOGIN</button>
            </div>
            <div className="admin-link">
              <div className="admin-forget-password">
                <Link to="/forgotpassword"
                      className="admin-forget-link">
                  Forgot Password
                </Link>
              </div>
              <div className="admin-vertical-slash">|</div>
              <div className="admin-register">
                <a href="#" className="admin-register-link">Register</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
}