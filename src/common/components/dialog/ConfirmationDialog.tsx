import * as React from "react";


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
 * State
 */
interface DialogState {
  /**
   * the message to display
   */
  message?: string;
}


/**
 * Show the text box for searching
 */
export class ConfirmationDialog extends React.Component<Properties, DialogState> {

  state: DialogState = {
    message: ""
  };
  /**
   * the modal element
   */
  public modalElement: HTMLElement;

  /**
   * show the confirmation dialog
   */
  show(): Promise<boolean> {
    return new Promise((accept) => {
      $(this.modalElement).modal({
        closable: false,
        onApprove: () => accept(true),
        onDeny: () => accept(false)
      }).modal("show");
    });
  }

  /**
   * Component did mount
   */
  componentDidMount() {
    this.setState({message: this.props.message});
  }

  /**
   * component receive next props
   */
  componentWillReceiveProps(props) {
    this.setState({message: props.message});
  }

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
          <div className="ui black deny button">
            No
          </div>
          <div className="ui positive right labeled icon button">
            Yes
            <i className="checkmark icon"/>
          </div>
        </div>
      </div>
    )
  }
}