/**
 * Created by nghiant on 05/10/2016.
 */
import * as React from 'react';
import Group from '../Group';
import EditLinkTab from './EditLinkTab';
import EditImageTab from './EditImageTab';
import EditUserTab from './EditUserTab';
import EditPasswordTab from './EditPasswordTab';

/**
 * the edit user
 */
export default class EditProfiles extends React.Component<{}, {}> {
    props: any;
    state: any;
    active: any;

    /**
     * Constructor
     */
    constructor(props) {
        super(props);
        this.props = props;
        this.setActive();
    };

    setActive() {
        this.active = {tab_pane_user: 'tab-pane', tab_pane_image: 'tab-pane', tab_pane_password: 'tab-pane'};
        if (this.props.tab_user != null && this.props.tab_user != "") {
            this.active.tab_pane_user += ' ' + this.props.tab_user;
        }
        if (this.props.tab_image != null && this.props.tab_image != "") {
            this.active.tab_pane_image += ' ' + this.props.tab_image;
        }
        if (this.props.tab_password != null && this.props.tab_password != "") {
            this.active.tab_pane_password += ' ' + this.props.tab_password;
        }
    }

    render() {
        this.setActive();
        return (
            <div className="page-content">
                <div className="profile-content">
                    <div className="portlet light ">
                        <div className="portlet-title tabbable-line">
                            <NameProfile name="Update profile"/>
                            <EditLinkTab tab_user={this.props.tab_user} tab_password={this.props.tab_password}
                                         tab_image={this.props.tab_image}
                                         changeTabUser={this.props.changeTabUser}
                                         changeTabImage={this.props.changeTabImage}
                                         changeTabPassword={this.props.changeTabPassword}
                            />
                        </div>
                        <div className="portlet-body">
                            <div className="tab-content">
                                <EditUserTab tab_pane_user={this.active.tab_pane_user}/>
                                <EditPasswordTab tab_pane_password={this.active.tab_pane_password}/>
                                <EditImageTab image="./images/NoImage.jpg" tab_pane_image={this.active.tab_pane_image}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export class NameProfile extends React.Component<{}, {}> {
    props: any;

    render() {
        return (<div className="caption caption-md">
            <i className="icon-globe theme-font hide"></i>
            <span className="caption-subject font-blue-madison bold uppercase">{this.props.name}</span>
        </div>);
    }
}