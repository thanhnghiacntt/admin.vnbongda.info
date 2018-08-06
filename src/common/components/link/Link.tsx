import * as React from "react";

interface LinkControlProps {
  link?: string,
  label?: string,
  target?: string
}

interface  LinkControlState {

}

export class LinkControl extends React.Component<LinkControlProps,LinkControlState> {
  render() {
    return (<div className="ui field">
      <label> {this.props.label}</label>
      <a className="ui link" target={this.props? this.props.target: "_blank"}
         href={this.props.link}> {this.props.link} </a>
    </div>);
  }
}

