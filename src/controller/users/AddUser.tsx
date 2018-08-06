import * as React from 'react';
import {Helper} from "../../utils/Helper";
import {User} from "../../models/User";
import {TextField} from "../../common/components/input/TextField";
import {UserService} from "../../services/UserService";
import DropDownList from "../../common/components/dropdownlist/DropDownList";
import {DropDownListOption} from "../../common/components/dropdownlist/DropDownList";
import {InformationDialog} from "../../common/components/dialog/InformationDialog";
import {Loader} from "../../common/components/loader/Loader";
import {ResponseCode} from "../../common/network/ResponseCode";
import {Link} from "react-router-dom";
import {match, Redirect} from "react-router";
import {Authentication} from "../../utils/Authentication";

/**
 * the add user
 */
interface  UserState {
  user?: User,
  isAddNew?: boolean,
  doValidation?: boolean,
  roles?: DropDownListOption[],
  selectedRole?: string,
  isLoading?: boolean,
  message?: string,
  readOnly?: string;
}

interface UserProps {
  match: match<any>
}

export default class AddUser extends React.Component<UserProps, UserState> {
  private userService = new UserService();
  private lstRole: DropDownListOption[] = [{text: "--Role--", value: ""}];
  private info: InformationDialog = new InformationDialog();

  redirectToUsers = false;
  /**
   * Constructor
   */
  constructor(props) {
    super(props);
    this.props = props;

  };

  state: UserState = {
    isAddNew: false,
    doValidation: false,
    user: {}
  };

  componentDidMount() {
    if (this.props.match.params && this.props.match.params.userId) {
      this.setState({
        isAddNew: false
      });
      this.getUser(this.props.match.params.userId);

    } else {
      //let cats = await this.loadCategories();
      this.setState({
        isAddNew: true,
      });
    }
    Helper.setPageTitle(this.state.isAddNew ? "Add User" : "Edit User");
    this.lstRole.push({text: "Administrator", value: "Administrator"});
    this.lstRole.push({text: "Moderator", value: "Moderator"});
    this.lstRole.push({text: "User", value: "User"});
    this.setState({roles: this.lstRole});
  }

  render() {
    return (
      <div className="ui blurring content-box">
        {this.redirectToUsers ? <Redirect to="/users" /> : null}
        <Loader isLoading={this.state.isLoading}/>
        <InformationDialog icon="archive icon"
                           title="Information Message"
                           message={this.state.message}
                           ref={dialog => this.info = dialog}/>

        <div className="ui grid ui form">
          <div className="eight wide column">

            <TextField
              caption="Username"
              validateFunc={(value)=>{return Helper.validUserName(value)}}
              value={this.state.user.username}
              errorMessage={"The username field must be 5 - 50 characters in length, include characters, numbers and no space ."}
              maxLength={50}
              readOnly={!this.state.isAddNew? "readOnly": this.state.readOnly}
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
              maxLength={100}
              name={"email"}
              validateFunc={(email)=>{
                  return Helper.validateEmail(email)}
                }
              errorMessage={"The email field is invalid."}
              isRequired={true}
              readOnly={!this.state.isAddNew? "readOnly": this.state.readOnly}
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
            <DropDownList
              defaultValue={this.state.user.role||"" }
              doValidation={this.state.doValidation}
              isRequired={true}
              disabled={this.state.readOnly=="readOnly"? true: false}
              name="role"
              onChange={(value)=> {
                  this.state.user.role= value;
                  this.setState({selectedRole: value});
                 }}
              data={this.state.roles || []}
              label={"Role"}/>
          </div>
          <div className="eight wide column">
            <TextField
              caption="Password"
              value={this.state.user.password}
              maxLength={40}
              type={"password"}
              placeholder={"Password"}
              validateFunc={(value)=>{
                  if (!Helper.isNullOrEmpty(value) && value.length < 6) {
                    return false;
                  }
                  return true;
                }}
              isRequired={this.state.isAddNew}
              name={"password"}
              errorMessage={"The password field must be at least 6 characters in length."}
              doValidation={this.state.doValidation}
              onChange={value => {
                         this.state.user.password = value;
                       }}/>
          </div>
          <div className="eight wide column">
            <TextField
              caption="Confirm Password"
              value={this.state.user.confirmPassword}
              maxLength={40}
              type={"password"}
              name={"password"}
              isRequired={this.state.isAddNew}
              errorMessage={"Confirm password does not match."}
              placeholder={"Confirm Password"}
              validateFunc={(value)=>{
                  if(!Helper.isNullOrEmpty(this.state.user.password) && value!=this.state.user.password)
                    {
                      return false;
                    }
                    return true;
                }}
              doValidation={this.state.doValidation}
              onChange={value => {
                         this.state.user.confirmPassword = value;
                       }}/>
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
    this.setState({isLoading: true});
    let res = await this.userService.getUser(id);
    if (res.code == ResponseCode.success) {
      let currentLoginUser = Authentication.getUser();
      this.setState({
        user: res ? res.data : {},
        selectedRole: this.state.user ? this.state.user.role : "",
        isLoading: false
      });
    } else {
      this.setState({
        user: {},
        message: res.message,
        isLoading: false
      });
    }

  }

  validate() {

    if (Helper.isNullOrEmpty(this.state.user.firstName))
      return false;
    if (Helper.isNullOrEmpty(this.state.user.lastName))
      return false;
    if (Helper.isNullOrEmpty(this.state.user.email) || !Helper.validateEmail(this.state.user.email))
      return false;
    if (Helper.isNullOrEmpty(this.state.user.username) || !Helper.validUserName(this.state.user.username))
      return false;
    if ((Helper.isNullOrEmpty(this.state.user.password) && this.state.isAddNew) || (!Helper.isNullOrEmpty(this.state.user.password) && this.state.user.password.length < 6))
      return false;
    if (Helper.isNullOrEmpty(this.state.user.role))
      return false;


    //valid pass
    if (!Helper.isNullOrEmpty(this.state.user.password) && this.state.user.confirmPassword != this.state.user.password) {
      return false;
    }

    return true;
  }

  async saveUser() {
    this.setState({
      message: "User has been saved successfully.",
      isLoading: true,
      doValidation: true
    });
    if (this.validate()) {
      let response = await this.userService.saveUser(this.state.user);
      if (response.code != ResponseCode.success) {
        let message = response.message;
        if (response.code == "email_existed") {
          message = "Email is existed. Please enter another email.";
        } else if (response.code == "username_existed") {
          message = "Username is existed. Please enter another name.";
        }
        this.setState({message: message, isLoading: false});
        this.info.show();
        return;
      }
      this.setState({isLoading: false});
      await this.info.show();
      if (this.state.isAddNew && response.code == ResponseCode.success) {
        Helper.navigateTo("/users")
        return;
      }
    }
    this.setState({isLoading: false});
  }

  renderMenu() {
    return (<div className="ui secondary menu">
      <div className="ui menu right">
        <div className="item">
          <button onClick={async()=>{
           await this.saveUser();
          }} className="ui blue icon button"><i className="ui icon save"/>
            Save
          </button>
        </div>
        <div className="item">
          <Link
            to={"/users"}
            className={"ui icon blue basic button"}>
            Cancel
          </Link>
        </div>
      </div>
    </div>)
  }
}