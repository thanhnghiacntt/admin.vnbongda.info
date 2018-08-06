import * as React from "react";

/**
 * Component properties
 */
interface Properties {

  /**
   * message to display in this section
   */
  message: string;

  /**
   * class name
   */
  className: string;
}


/**
 * the header - showing the header of a page
 */
export class Message extends React.Component<Properties, {}> {

  /**
   * render the loader
   */
  render() {
    return (
      <div style={{display: this.props.message ? "block" : "none"}}
           className={"ui message " + this.props.className}>
        { this.props.message }
      </div>
    )
  }
}