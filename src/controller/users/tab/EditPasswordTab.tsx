/**
 * Created by nghiant on 06/10/2016.
 */
import * as React from 'react';
import Group from '../Group';

/**
 * the add user
 */
export default class TabEditPassword extends React.Component<{}, {}> {
    props:any;

    /**
     * Render html
     */
    render() {
        return (<div className={this.props.tab_pane_password} id="tab_password">
                    <form className="ui form" action="#">
                        <Group inputName="current_password" inputType="password" labelName="Current Password"/>
                        <Group inputName="new_password" inputType="password" labelName="New Password"/>
                        <Group inputName="renew_password" inputType="password" labelName="Re-type New Password"/>
                        <div className="margin-top-10">
                            <a href="javascript:;" className="ui teal button "> Change Password </a>
                            <a href="javascript:;" className="ui button"> Cancel </a>
                        </div>
                    </form>
                </div>)};
}