import * as React from "react";
import { Unsubscribe } from "redux"
import { UserService } from "../services/UserService";
import { AppEvent, AppStore, Language } from "../redux/AppStore";
import { BrowserRouter as Router, Redirect, NavLink, Link } from 'react-router-dom';
import { Nav, NavItem, NavDropdown, MenuItem, Dropdown } from 'react-bootstrap';
import {Menu} from "./Menu";
import {Authentication} from "../helpers/Authentication";
export interface NavBarProps {
  onLogOut?: Function
  changeLanguage?: Function
  history?: any;
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class NavbarContaint extends React.Component<any, {}> {

  redirect = false;
  unsubscribe: Unsubscribe;
  pageTitle = AppStore.getState().pageTitle;
  redirectLink = "";

  constructor(props: any) {
    super(props);
  }

  strings = AppStore.getState().strings;

  changeLanguage(lang: Language) {
    AppStore.postEvent(AppEvent.changeLanguague, lang);
  }

  handleLogin() {
    Authentication.logout();
    if (Authentication.isLogin()) {
      AppStore.postEvent(AppEvent.logout, true);
    } else {
      this.redirect = true;
      this.redirectLink = "/signin";
      this.setState({})
    }
  }
  handleSetting() {
    this.redirect = true;
    this.redirectLink = "/user/setting";
    this.setState({})
  }

  handleSelect = (eventKey: any) => {
    switch (eventKey) {
      case "logout":
        this.handleLogin();
        break
      case "setting":
        this.handleSetting();
        break
      case "lang_en":
        this.changeLanguage(Language.en);
        break
      case "lang_vi":
        this.changeLanguage(Language.vi);
        break
    }
  }

  componentDidMount() {
    this.unsubscribe = AppStore.subscribe((state) => {
      switch (state.event) {
        case AppEvent.changePageTitle:
          this.pageTitle = state.pageTitle
          this.setState({})
          break;
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    if (this.redirect) {
      this.redirect = false;
      return (<Redirect to={this.redirectLink} />)
    }
    let lang = Authentication.getLanguage();
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-blue">
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="ml-auto navbar-nav">
            <li className="nav-item">
              <img src="/data/images/logo.jpg" onClick={()=>{this.redirect = true; this.setState({})}}></img>
            </li>
          </ul>
          <Menu />
          <ul className="ml-auto navbar-nav">
            <li className="nav-item language">
              <Dropdown id="avata-toggle" className="bg-blue">
                <Dropdown.Toggle>
                  {lang == "en" && <i title="English"><img src="/data/images/en.svg" /></i>}
                  {lang == "vi" && <i title="Tiếng Việt"><img src="/data/images/vi.svg" /></i>}
                </Dropdown.Toggle>
                <Dropdown.Menu onSelect={this.handleSelect} className="dropdown-item bg-blue">
                  {lang !== "en" && <MenuItem eventKey="lang_en"><img src="/data/images/en.svg" />English</MenuItem>}
                  {lang !== "vi" && <MenuItem eventKey="lang_vi"><img src="/data/images/vi.svg" />Tiếng Việt</MenuItem>}
                </Dropdown.Menu>
              </Dropdown>
            </li>
            {
              Authentication.isLogin() ?
                <li className="nav-item user">
                  <Dropdown id="avata-toggle" className="bg-blue">
                    <Dropdown.Toggle>
                      <img src="/data/images/admin.jpg" className="img-avatar hide" alt="admin@iotlink.com.vn" />
                      <span className="d-md-down-none">admin</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu onSelect={this.handleSelect} className="dropdown-item bg-blue">
                      <MenuItem eventKey="setting"><i className="fa fa-cog"></i>{this.strings.setting}</MenuItem>
                      <MenuItem eventKey="logout"><i className="fa fa-sign-out"></i>{this.strings.logout}</MenuItem>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>: null
            }

          </ul>
        </div>
      </nav>
    )
  }
}