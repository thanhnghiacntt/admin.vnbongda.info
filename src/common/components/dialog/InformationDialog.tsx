import * as React from "react";
import {ConfirmationDialog} from "./ConfirmationDialog";


/**
 * Component properties
 */
interface Properties {

  /**
   * icon of the dialog
   */
  icon?: string;

  /**
   * value of the text box
   */
  title: string;

  /**
   * the message to display
   */
  message: string;
}


/**
 * Show the text box for searching
 */
export class InformationDialog extends ConfirmationDialog {

  /**
   * render the search box
   */
  render() {
    return (
      <div className="ui small modal" ref={element => this.modalElement = element}>
        <div className="header">
          <i className={this.props.icon}/>
          {this.props.title}
        </div>
        <div className="content">
          <div className="description">
            <p>{this.state.message}</p>
          </div>
        </div>
        <div className="actions">
          <div className="ui positive right labeled icon button">
            OK
            <i className="checkmark icon"/>
          </div>
        </div>
      </div>
    )
  }
}