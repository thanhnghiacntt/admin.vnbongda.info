import * as React from "react";
import { match, Redirect } from 'react-router';
import { Panel} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AppStore, AppEvent } from "../../redux/AppStore";
import { UserService} from "../../services/UserService"
import { UserTable } from './UserTable';
import { Action } from '../CommonTable/TRow';
import {User} from "../../models/User";
import {Pagging, PaggingProps} from "../../containers/Pagging";

// Booking props interface
export interface UserProps {
    match: match<any>;
}

export class UserComponent extends React.Component<UserProps, any> {

    strings: any
    data: Array<User>
    selectedItem: any
    filter: any
    pagging: PaggingProps

    constructor(props: UserProps) {
        super(props)
        this.strings = AppStore.getState().strings
        this.filter = {
            page: 1,
            size: AppStore.getState().pageSize,
            searchItem: null//UserService.shared.getNewUser()
        }
        //let result = UserService.shared.getUsers(this.filter)
        //this.data = result.data
        let pageSize = AppStore.getState().pageSize
        //this.pagging = Pagging.createPagging(result.count)
    }

    search() {
        //let result = UserService.shared.getUsers(this.filter)
        //this.data = result.data
        //this.pagging.pageCount = Math.floor(result.count / this.pagging.pageSize) + (result.count % this.pagging.pageSize ? 1 : 0)
        console.log(`set ${this.pagging.pageCount}`)
        this.setState({})
    }

    handleCellClick = (field: any, key: any) => {
        console.log(`Click on field ${field} of row has key ${key}`)
        this.selectedItem = key
        this.setState({})
    }

    handleAction = (type: Action, key: any) => {
        switch (type) {
            case Action.Detail:
                this.selectedItem = key
                break
        }
        this.setState({})
    }

    handleSearch = (field: string, value: any) => {
        this.filter.searchItem[field] = value
        this.search()
    }

    handlePageSizeChange = (size: number) => {
        this.filter.size = size
        this.filter.page = 1
        this.pagging.pageSize = size
        this.pagging.activePage = 1
        AppStore.postEvent(AppEvent.changePageSize, size)
        this.search()
    }

    handleSelectPage = (page: number) => {
        this.filter.page = page
        this.pagging.activePage = page
        this.search()
    }

    componentDidMount() {
        AppStore.postEvent(AppEvent.changePageTitle, this.strings.user);
    }

    render() {
        return (
            this.selectedItem ?
                <Redirect to={`/user/update/${this.selectedItem}`} from={this.props.match.path} />
                :
                <div>
                    <div className="content-header clearfix">
                        <div className="pull-right">
                            <Link to="/user/add" className="btn btn-primary"><i className="fa fa-plus-square"></i>{this.strings.btn_add_new}</Link>
                            {this.props.children}
                        </div>
                    </div>
                    <div className="content">
                        <Panel>
                            <UserTable data={this.data}
                                handleSearch={this.handleSearch}
                                onAction={this.handleAction} />
                            <Pagging pageSize={this.pagging.pageSize}
                                pageCount={this.pagging.pageCount}
                                activePage={this.pagging.activePage}
                                maxButtons={this.pagging.maxButtons}
                                onPageSizeChange={this.handlePageSizeChange}
                                onSelectPage={this.handleSelectPage} />
                        </Panel>
                    </div>
                </div>
        );
    }
}
