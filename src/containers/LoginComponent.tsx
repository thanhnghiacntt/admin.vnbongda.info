import * as React from "react";
import { match, Redirect } from "react-router";
import { UserService } from "../services/UserService";
import { AppEvent, AppStore } from "../redux/AppStore";
import { Row, Col, NavDropdown, MenuItem, Dropdown, FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { LanguagePicker } from './LanguagePicker';

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.

interface LoginProps {
  match: match<any>
  location?: any
}

export class LoginComponent extends React.Component<LoginProps, any> {

  private name: HTMLInputElement
  private pass: HTMLInputElement
  strings: any = AppStore.getState().strings

  login = () => {
    let email = this.name.value
    let pass = this.pass.value
    UserService.shared.login(email, pass, (data) => {
      if (data)
      {
        AppStore.postEvent(AppEvent.login, true)
        this.setState({})
      }
      else{
        console.log("Thong bao loi, dang nhap that bai!")
      }
    })
  }


  render() {
    let from = { pathname: '/' };
    const state = this.props.location.state;
    if (state != null && state.from != null) {
      from = state.from
    }

    if (UserService.shared.isLoggedIn()) {
      return <Redirect to={from} />
    }
    else
      return (
        <div className="login">
          <div className="app flex-row align-items-center">
            <div className="container">
              <Row className="justify-content-center login-form">
                <Col md={5} className="login-panel">
                  <h1>{this.strings.login}</h1>
                  <p className="text-muted">{this.strings.login_caption}</p>
                  <FormGroup>
                    <InputGroup>
                      <InputGroup.Addon><i className="fa fa-user" aria-hidden="true"></i></InputGroup.Addon>
                      <FormControl type="text" inputRef={(input: HTMLInputElement) => { this.name = input; }} />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup>
                      <InputGroup.Addon><i className="fa fa-lock" aria-hidden="true"></i></InputGroup.Addon>
                      <FormControl type="password" inputRef={(input: HTMLInputElement) => { this.pass = input; }} />
                    </InputGroup>
                  </FormGroup>
                  <Row>
                    <Col md={6}>
                      <Button bsStyle="info" onClick={this.login}>{this.strings.login}</Button>
                    </Col>
                    <Col md={6} className="text-right language">
                      <LanguagePicker />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      );
  }
}
