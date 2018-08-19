import * as React from "react";
import { match, Redirect } from 'react-router';
import { Table, Button, FormGroup, ControlLabel, FormControl, HelpBlock, Col, Form, Panel, Modal } from 'react-bootstrap';
import { UserService, Role } from '../../services/UserService';
import { AppStore, AppEvent } from "../../redux/AppStore";
import {User} from "../../models/User";

export interface UpdateUserProps {
    match: match<any>
}

export interface UpdateUserState {
    data: User
    showModal?: boolean
}

export class ProfileComponent extends React.Component<UpdateUserProps, UpdateUserState>{

    redirect = false;
    strings: any;
    roles: Array<any>;
    curentRole: Role;
    isManager: boolean;
    private password: HTMLInputElement;
    private passwordConfirm: HTMLInputElement;
    private passwordOld: HTMLInputElement;
    canChange: boolean = false;
    focused: boolean = false;

    constructor(props: UpdateUserProps) {
        super(props);
        let user: User;
        //user = UserService.shared.getUser(UserService.shared.getCurrentId())
        this.state = { data: user }

        if (user) {
            this.state = { data: user }
        }
        else {
            this.redirect = true
        }
        //this.roles = UserService.shared.getRoles()
        this.strings = AppStore.getState().strings
        //this.isManager = UserService.shared.getRole() == Role.Manager
    }
    handleInputChange = (field: string, e: React.FormEvent<FormGroup>) => {
        let data = this.state.data
        let target = e.target as any
        // if (data[field] && (typeof data[field].id != "undefined")) {
        //     data[field].id = target.value
        //     data[field].name = target.selectedOptions[0].innerText
        // }
        // else {
        //     data[field] = target.value
        // }
        this.setState({ data: data })
    }

    saveUser = () => {
        // if (UserService.shared.upSert(this.state.data)) {
        //     this.redirect = true
        // }
        this.setState({})
    }

    deteltUser = () => {
        // if (UserService.shared.delete(this.state.data.user_id)) {
        //     this.redirect = true
        // }
        this.setState({})
    }

    componentDidMount() {
        AppStore.postEvent(AppEvent.changePageTitle, this.strings.user);
    }

    cancel = () => {
        this.redirect = true
        this.setState({})
    }

    openModal = () => {
        this.setState({ showModal: true })
    }

    closeModal = () => {
        this.setState({ showModal: false })
    }

    saveModal = () => {
        let saveUser = {
            id: this.state.data.id,
            old_password: this.passwordOld.value,
            new_password: this.password.value
        }
        //UserService.shared.updatePassword(saveUser)
        this.setState({ showModal: false })
    }

    focusOnConfirmPassword = () => {
        this.focused = true
        this.setState({})
    }

    validatePassword = () => {
        this.canChange = this.password.value == this.passwordConfirm.value
        this.setState({})
    }

    render() {
        let user = this.state.data
        return (
            this.redirect ?
                <Redirect to="/" />
                :
                <div>
                    <div className="content user-info">
                        <Panel>
                            <Form horizontal className="customer-info panel-body">
                                <Col md={5} className="user-image">
                                    <div className="image">
                                        <img src="/src/images/admin.jpg" />
                                        <span className="change-image"><i className="fa fa-pencil"></i></span>
                                    </div>
                                </Col>
                                <Col md={7}>
                                    <Panel>
                                        <FormGroup bsSize="small" controlId="userName">
                                            <Col componentClass={ControlLabel} md={4}>
                                                {this.strings.label_user_name}
                                            </Col>
                                            <Col md={8}>
                                                <FormControl type="text" value={user.firstName + " " + user.lastName} onChange={(e) => this.handleInputChange("name", e)} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup bsSize="small" controlId="userEmail">
                                            <Col componentClass={ControlLabel} md={4}>
                                                {this.strings.label_email}
                                            </Col>
                                            <Col md={8}>
                                                <FormControl type="email" value={user.email} onChange={(e) => this.handleInputChange("email", e)} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup bsSize="small" controlId="userRole">
                                            <Col md={8} mdOffset={4}>
                                                <Button className="form-control">Save</Button>
                                            </Col>
                                        </FormGroup>
                                    </Panel>
                                    <Panel>
                                        <FormGroup bsSize="small" controlId="userPass">
                                            <Col componentClass={ControlLabel} md={4}>
                                                {this.strings.label_password_old}
                                            </Col>
                                            <Col md={8}>
                                                <FormControl onChange={this.validatePassword} autoComplete="off" type="password" inputRef={(input: HTMLInputElement) => { this.passwordOld = input; }} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup bsSize="small" controlId="userNewPass">
                                            <Col componentClass={ControlLabel} md={4}>
                                                {this.strings.label_password_new}
                                            </Col>
                                            <Col md={8}>
                                                <FormControl onChange={this.validatePassword} autoComplete="off" type="password" inputRef={(input: HTMLInputElement) => { this.password = input; }} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup bsSize="small" controlId="userConfirmPass">
                                            <Col componentClass={ControlLabel} md={4}>
                                                {this.strings.label_password_comfirm}
                                            </Col>
                                            <Col md={8}>
                                                <FormControl onFocus={this.focusOnConfirmPassword} onChange={this.validatePassword} autoComplete="off" type="password" inputRef={(input: HTMLInputElement) => { this.passwordConfirm = input; }} />
                                                {this.focused && !this.canChange && <p className="text-danger">{this.strings.label_change_password_warning}</p>}
                                            </Col>
                                        </FormGroup>
                                        <FormGroup bsSize="small" controlId="userRole">
                                            <Col md={8} mdOffset={4}>
                                                <Button className="form-control" disabled={!this.canChange} bsStyle="primary" onClick={this.saveModal}>{this.strings.btn_save}</Button>
                                            </Col>
                                        </FormGroup>
                                    </Panel>
                                </Col>
                            </Form>
                        </Panel>
                    </div>
                    <Modal show={this.state.showModal} onHide={this.closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>{this.strings.label_change_password}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <FormGroup className={this.isManager ? "hide" : ""}>
                                    <ControlLabel>{this.strings.label_password_old}</ControlLabel>
                                    <FormControl onChange={this.validatePassword} autoComplete="off" type="password" inputRef={(input: HTMLInputElement) => { this.passwordOld = input; }} />
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>{this.strings.label_password_new}</ControlLabel>
                                    <FormControl onChange={this.validatePassword} autoComplete="off" type="password" inputRef={(input: HTMLInputElement) => { this.password = input; }} />
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>{this.strings.label_password_comfirm}</ControlLabel>
                                    <FormControl onFocus={this.focusOnConfirmPassword} onChange={this.validatePassword} autoComplete="off" type="password" inputRef={(input: HTMLInputElement) => { this.passwordConfirm = input; }} />
                                </FormGroup>
                                {this.focused && !this.canChange && <p className="text-danger">{this.strings.label_change_password_warning}</p>}
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.closeModal}>{this.strings.btn_cancel}</Button>
                            <Button disabled={!this.canChange} bsStyle="primary" onClick={this.saveModal}>{this.strings.btn_save}</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
        )

    }
}