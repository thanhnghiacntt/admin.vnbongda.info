import * as React from "react";
import { Unsubscribe } from "redux"
import { UserService } from "../services/UserService";
import { AppEvent, AppStore, Language } from "../redux/AppStore";
import { BrowserRouter as Router, Redirect, NavLink, Link } from 'react-router-dom'
import { Nav, NavItem, NavDropdown, MenuItem, Dropdown } from 'react-bootstrap'

export class LanguagePicker extends React.Component<any, any> {
  changeLanguage(lang: Language) {
    AppStore.postEvent(AppEvent.changeLanguague, lang);
  }

  handleSelect = (eventKey: any) => {
    switch (eventKey) {
      case "lang_en":
        this.changeLanguage(Language.en);
        break;
      case "lang_vi":
        this.changeLanguage(Language.vi);
        break;
    }
  };

  render() {
    let lang = UserService.shared.getLanguage();
    return (
      <Dropdown  id="avata-toggle">
        <Dropdown.Toggle>
          {lang == "en" && <i title="English"><img src="/data/images/en.svg" /></i>}
          {lang == "vi" && <i title="Tiếng Việt"><img src="/data/images/vi.svg" /></i>}
          </Dropdown.Toggle>
        <Dropdown.Menu onSelect={this.handleSelect} className="dropdown-menu-right">
          {lang !== "en" && <MenuItem eventKey="lang_en" className="dropdown-item"><img src="/data/images/en.svg" />English</MenuItem>}
          {lang !== "vi" && <MenuItem eventKey="lang_vi" className="dropdown-item"><img src="/data/images/vi.svg" />Tiếng Việt</MenuItem>}
          </Dropdown.Menu>
      </Dropdown>
    )
  }
}