import * as React from "react";
import {Helper} from "../../utils/Helper";
import {UserService} from "../../services/UserService";
import {InformationDialog} from "../../common/components/dialog/InformationDialog";


interface  ResetPasswordState {
  password?: string;
  confirmPassword?: string;
  message?: string;
  confirmMessage?: string;
  invalid?: boolean;
  invalidConfirm?: boolean;
  doValidate?: boolean;
  sent?: boolean;
  alertMessage?: string;
}
interface ResetPasswordProps {
  location: any;
}
/**
 * the login form
 */
export default class ResetPassword extends React.Component<ResetPasswordProps, ResetPasswordState> {

  private info = new InformationDialog();
  private userService = new UserService();
  state: ResetPasswordState = {
    password: "",
    message: "",
    invalid: false,
  };

  valid() {

    let isValid = true;
    if (Helper.isNullOrEmpty(this.state.password)) {
      this.setState({message: "The password field is required.", invalid: true});
      isValid = false;
    } else if (this.state.password.length < 6) {
      this.setState({message: "The password field must be at least 6 characters in length.", invalid: true});
      isValid = false;
    } else {
      isValid = true;
      this.setState({invalid: false});
    }
    if (Helper.isNullOrEmpty(this.state.confirmPassword)) {
      this.setState({confirmMessage: "The confirm password field is required.", invalidConfirm: true});
      isValid = false;
    } else if (this.state.confirmPassword.length < 6) {
      this.setState({
        confirmMessage: "The password field must be at least 6 characters in length.",
        invalidConfirm: true
      });
      isValid = false;
    } else if (this.state.confirmPassword != this.state.password) {
      this.setState({confirmMessage: "Confirm password does not match.", invalidConfirm: true});
      isValid = false;
    } else {
      isValid = true;
      this.setState({invalidConfirm: false});
    }
    return isValid;
  }

  async resetPassword() {
    let token = this.props.location.query.token || "";
    this.setState({doValidate: true});
    if (this.valid()) {
      let response = await this.userService.renewPassword(this.state.password, token);
      this.setState({alertMessage: response.message});
      await this.info.show();
      Helper.navigateTo("/login");
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="ui middle aligned center aligned grid">
        <InformationDialog message={this.state.alertMessage} ref={(d)=>{this.info = d;}} title={"Information"}/>
        <div style={{minWidth: "450px"}} className="column">
          <h2 className="ui blue header">
            <div className="content">
              Create New Password
            </div>
          </h2>

          <form className="ui large form">
            <div className="ui segment">
              <div className="field">
                <div className="ui left icon input">
                  <i className="lock  icon"/>
                  <input onChange={(e)=>{
                    this.state.password = e.target.value;
                     this.valid();
                  }} type="password" name="email"
                         placeholder="New Password"/>

                </div>
                <label style={{visibility: this.state.invalid && this.state.doValidate? "":"hidden"}} formTarget="email"
                       className="errorMessage">{this.state.message}</label>
              </div>
              <div className="field">
                <div className="ui left icon input">
                  <i className="lock  icon"/>
                  <input onChange={(e)=>{
                    this.state.confirmPassword=e.target.value;
                    this.valid();

                  }} type="password" name="email"
                         placeholder="Confirm Password"/>

                </div>
                <label style={{visibility: this.state.invalidConfirm && this.state.doValidate? "":"hidden"}} formTarget="email"
                       className="errorMessage">{this.state.confirmMessage}</label>
              </div>

              <div onClick={()=>{this.resetPassword();}} className="ui fluid large blue submit button">
                Reset Password
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

}