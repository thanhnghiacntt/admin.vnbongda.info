import * as React from "react";
import {Helper} from "../../utils/Helper";
import {UserService} from "../../services/UserService";
import {ResponseCode} from "../../common/network/ResponseCode";
import {Spinner} from "../../common/components/loader/Spinner";


interface ForgotPasswordState {
  email?: string;
  message?: string;
  invalid?: boolean;
  doValidate?: boolean;
  sent?: boolean;
}

/**
 * the login form
 */
export default class ForgotPassword extends React.Component<{}, {}> {

  private userService = new UserService();
  state: ForgotPasswordState = {
    email: "",
    message: "",
    invalid: false,
  };

  valid() {
    if (Helper.isNullOrEmpty(this.state.email)) {
      this.setState({message: "The email field is required.", invalid: true});
      return false;
    }
    if (this.state.email.indexOf("@") != -1 && !Helper.validateEmail(this.state.email)) {
      this.setState({message: "The email field is invalid.", invalid: true});
      return false;
    }
    if (this.state.email.indexOf("@") == -1 && !Helper.validateEmail(this.state.email)) {
      this.setState({
        message: "The username field must be 5 - 50 characters in length, include characters, numbers and no space .",
        invalid: true
      });
      return false;
    }
    this.setState({invalid: false});
    return true;
  }

  async resetPassword() {
    this.setState({doValidate: true});
    if (this.valid()) {
      Spinner.show(true);
      let response = await this.userService.resetPassword(this.state.email);
      if (response && response.code != ResponseCode.success) {
        this.setState({message: response.message, invalid: true, isLoading: false});
        return;
      }
      this.setState({sent: true});
      Spinner.show(false);
    }
  }

  render() {
    return (
      this.state.sent ?
        <div>
          <div className="ui message visible positive"><h2>Password request sent</h2></div>
        </div>
        :
        <div className="ui middle aligned center aligned grid">
          <div style={{maxWidth: "450px", width: "100%"}} className="column">
            <h2 className="ui blue header">
              <div className="content">
                Forgot Password?
              </div>
            </h2>
            <h3> You can reset your password here.</h3>
            <form className="ui large form">
              <div className="ui segment">
                <div className="field">
                  <div className="ui left icon input">
                    <i className="user icon"/>
                    <input onChange={(e) => {
                      this.state.email = e.target.value;
                      this.valid()

                    }} type="text" name="email" placeholder="E-mail address"/>

                  </div>
                  <label style={{display: this.state.invalid && this.state.doValidate ? "" : "none"}} formTarget="email"
                         className="errorMessage">{this.state.message}</label>
                </div>

                <div onClick={async () => {
                  await this.resetPassword();
                }} className="ui fluid large blue submit button">
                  Reset Password
                </div>
              </div>
            </form>
          </div>
        </div>
    );
  }

}