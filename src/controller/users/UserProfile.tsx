import * as React from 'react';
import {Helper} from "../../utils/Helper";
import {User} from "../../models/User";
import {TextField} from "../../common/components/input/TextField";
import {UserService} from "../../services/UserService";
import {DropDownListOption} from "../../common/components/dropdownlist/DropDownList";
import {InformationDialog} from "../../common/components/dialog/InformationDialog";
import {Loader} from "../../common/components/loader/Loader";
import {TokenService} from "../../services/TokenService";
import {Authentication} from "../../utils/Authentication";
import {Redirect} from "react-router";
import {ResponseCode} from "../../common/network/ResponseCode";
import {Response} from "../../common/network/HttpClient";
import {Spinner} from "../../common/components/loader/Spinner";
import {Dialog} from "../../common/components/dialog/Dialog";

/**
 * the add user
 */
interface UserProfileState {
  user?: User,
  doValidation?: boolean,
  roles?: DropDownListOption[],
  selectedRole?: string,
  isAddNew?: boolean
}

interface UserProfileProps {
}

export default class UserProfile extends React.Component<UserProfileProps, UserProfileState> {
  private userService = new UserService();
  private lstRole: DropDownListOption[] = [{text: "--Role--", value: ""}];
  private info: InformationDialog = new InformationDialog();

  redirectToUser = false;

  /**
   * Constructor
   */
  constructor(props) {
    super(props);
    this.props = props;

  };

  state: UserProfileState = {
    isAddNew: false,
    doValidation: false,
    user: {}
  };

  componentDidMount() {
    Helper.setPageTitle("User Profiles");
    this.lstRole.push({text: "Administrator", value: "Administrator"});
    this.lstRole.push({text: "Moderator", value: "Moderator"});
    this.lstRole.push({text: "User", value: "User"});
    let user = Authentication.getUser();
    user.password = "";
    this.setState({user: user, roles: this.lstRole});
  }

  render() {

    if (this.redirectToUser) {
      this.redirectToUser = false
      return (<Redirect to="/users"/>)
    }

    return (
      <div className="ui blurring content-box">
        <div className="ui grid ui form">
          <div className="eight wide column">

            <TextField
              caption="Username"
              validateFunc={(value) => {
                return Helper.validUserName(value)
              }}
              value={this.state.user.username}
              errorMessage={"The username field must be 5 - 50 characters in length, include characters, numbers and no space ."}
              maxLength={50}
              readOnly={"readOnly"}
              name={"username"}
              isRequired={true}
              doValidation={this.state.doValidation}
              onChange={value => {
                this.state.user.username = value;
              }}/>
          </div>
          <div className="eight wide column">
            <TextField
              caption="Email"
              value={this.state.user.email}
              readOnly={"readOnly"}
              maxLength={100}
              name={"email"}
              validateFunc={(email) => {
                return Helper.validateEmail(email)
              }
              }
              errorMessage={"The email field is invalid."}
              isRequired={true}
              doValidation={this.state.doValidation}
              onChange={value => {
                this.state.user.email = value;
              }}/>
          </div>
          <div className="eight wide column">
            <div style={{marginBottom: '-5px'}} className="ui equal width grid">
              <div className="column">
                <TextField
                  caption="First Name"
                  value={this.state.user.firstName}
                  maxLength={40}
                  name={"firstName"}
                  isRequired={true}
                  doValidation={this.state.doValidation}
                  onChange={value => {
                    this.state.user.firstName = value;
                  }}/>
              </div>
              <div className="column">
                <TextField
                  caption="LastName"
                  value={this.state.user.lastName}
                  maxLength={40}
                  isRequired={true}
                  name={"lastName"}
                  doValidation={this.state.doValidation}
                  onChange={value => {
                    this.state.user.lastName = value;
                  }}/>
              </div>
            </div>
          </div>
          <div className="eight wide column">
            <TextField
              caption="Role"
              value={this.state.user.role}
              errorMessage={"The username field must be 5 - 50 characters in length, include characters, numbers and no space ."}
              maxLength={50}
              readOnly={"readOnly"}
              name={"role"}
              isRequired={true}
              doValidation={this.state.doValidation}
            />
          </div>
          <div className="eight wide column">
            <TextField
              caption="Old Password"
              maxLength={40}
              value={this.state.user.oldPassword}
              type={"password"}
              placeholder={"Old Password"}
              validateFunc={(value) => {
                if (!Helper.isNullOrEmpty(value) && value.length < 6) {
                  return false;
                }
                if (!Helper.isNullOrEmpty(this.state.user.password || this.state.user.confirmPassword) && Helper.isNullOrEmpty(this.state.user.oldPassword))
                  return false;
                return true;
              }}
              name={"password"}
              errorMessage={"The password field must be at least 6 characters in length."}
              doValidation={this.state.doValidation}
              onChange={value => {
                this.state.user.oldPassword = value;
              }}/>
          </div>
          <div className="eight wide column">
            <div style={{marginBottom: '-5px'}} className="ui equal width grid">
              <div className="column">
                <TextField
                  caption="Password"
                  maxLength={40}
                  type={"password"}
                  value={this.state.user.password}
                  placeholder={"Password"}
                  validateFunc={(value) => {
                    if (!Helper.isNullOrEmpty(value) && value.length < 6) {
                      return false;
                    }
                    if ((!Helper.isNullOrEmpty(this.state.user.oldPassword) || !Helper.isNullOrEmpty(this.state.user.confirmPassword)) && Helper.isNullOrEmpty(this.state.user.password))
                      return false;
                    return true;
                  }}
                  name={"password"}
                  errorMessage={"The password field must be at least 6 characters in length."}
                  doValidation={this.state.doValidation}
                  onChange={value => {
                    this.state.user.password = value;
                  }}/>
              </div>
              <div className="column">
                <TextField
                  caption="Confirm Password"
                  maxLength={40}
                  type={"password"}
                  name={"password"}
                  errorMessage={"Confirm password does not match."}
                  placeholder={"Confirm Password"}
                  value={this.state.user.confirmPassword}
                  validateFunc={(value) => {
                    if (!Helper.isNullOrEmpty(this.state.user.password) && value != this.state.user.password) {
                      return false;
                    }
                    return true;
                  }}
                  doValidation={this.state.doValidation}
                  onChange={value => {
                    this.state.user.confirmPassword = value;
                  }}/>
              </div>
            </div>
          </div>
          <div className="sixteen wide column">
            {
              this.renderMenu()
            }
          </div>
        </div>
      </div>
    );
  }

  async getUser(id: string) {
    Spinner.show(true);
    let res = await  this.userService.getUser(id);
    let user = res ? res.data : {};
    user.password = "";
    this.setState({
      user: user,
      selectedRole: this.state.user ? this.state.user.role : "",

    });
    Spinner.show(false);
  }

  async save() {
    Spinner.show(true);
    this.setState({
      doValidation: true
    });

    if (this.validate()) {
      if (Helper.isNullOrEmpty(this.state.user.oldPassword)) {
        this.state.user.password = null
      }
      let response = (await this.userService.saveUser(this.state.user)) as Response;
      Spinner.show(false);
      if (response.code == ResponseCode.success) {
        //TODO: save successful
        let currentUser = Authentication.getUser();
        let updatedUser = response.data as User
        if (updatedUser.id == currentUser.id) {
          Authentication.saveUser(updatedUser)
        }
        Dialog.show("Information message", response.message);
      }
    }
    Spinner.show(false);
  }

  validate() {
    debugger
    if (!Helper.isNullOrEmpty(this.state.user.oldPassword) && this.state.user.oldPassword.length < 6) {
      return false;
    }
    if (Helper.isNullOrEmpty(this.state.user.firstName))
      return false;
    if (Helper.isNullOrEmpty(this.state.user.lastName))
      return false;
    if (!Helper.validateEmail(this.state.user.email))
      return false;
    if (!Helper.validUserName(this.state.user.username))
      return false;
    if (!Helper.isNullOrEmpty(this.state.user.confirmPassword || this.state.user.oldPassword) && Helper.isNullOrEmpty(this.state.user.password))
      return false;
    if (Helper.isNullOrEmpty(this.state.user.role))
      return false;
    if (!Helper.isNullOrEmpty(this.state.user.password || this.state.user.oldPassword) && Helper.isNullOrEmpty(this.state.user.confirmPassword))
      return false;
    if (!Helper.isNullOrEmpty(this.state.user.password || this.state.user.confirmPassword) && Helper.isNullOrEmpty(this.state.user.oldPassword))
      return false;
    return true;
  }

  renderMenu() {
    return (<div className="ui secondary menu">
      <div className="ui menu right">
        <div className="item">
          <button onClick={() => this.save()} className="ui blue icon button"><i className="ui icon save"/>
            Save
          </button>
        </div>
        <div className="item" onClick={() => {
          this.redirectToUser = true;
          this.setState({})
        }}>
          <button className="ui icon blue basic button">Cancel
          </button>
        </div>
      </div>
    </div>)
  }
}