/**
 * Created by nghiant on 06/10/2016.
 */
import * as React from 'react';


/**
 * the add user
 */
export default class EditLinkTab extends React.Component<{}, {}> {
    props:any;

    /**
     * Render html
     */
    render() {
        return (<ul className="nav nav-tabs">
                    <LiLink className={this.props.tab_user} onClick={this.props.changeTabUser} name="Personal Info"/>
                    <LiLink className={this.props.tab_image} onClick={this.props.changeTabImage} name="Change Avatar"/>
                    <LiLink className={this.props.tab_password} onClick={this.props.changeTabPassword} name="Change Password"/>
                </ul>)};
    }

export class LiLink extends React.Component<{}, {}> {
    props:any;

    /**
     * Render html
     */
    render() {
        return (<li className={this.props.className} onClick={this.props.onClick}>{this.props.name}</li>)};
}