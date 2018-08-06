/**
 * Created by nghiant on 06/10/2016.
 */
import * as React from 'react';
import Group from '../Group';


/**
 * the add user
 */
export default class TabEditUser extends React.Component<{}, {}> {
    props:any;

    /**
     * Render html
     */
    render() {
        return (<div className={this.props.tab_pane_user}  id="tab_user">
                    <form role="form" className="ui form" action="#">
                        <Group inputType="text" inputName="first_name" inputPlaceholder="John" labelName="First Name"/>
                        <Group inputType="text" inputName="last_name" inputPlaceholder="Doe" labelName="Last Name"/>
                        <Group inputType="text" inputName="phone" inputPlaceholder="+84.975.33.55.87" labelName="Mobile Number"/>
                        <Group inputType="text" inputName="website" inputPlaceholder="http://www.dekiconnect.com" labelName="Website Url"/>
                        <div className="margiv-top-10">
                            <a href="javascript:;" className="ui button teal"> Save Changes </a>
                            <a href="javascript:;" className="ui button"> Cancel </a>
                        </div>
                    </form>
                </div>)};
}