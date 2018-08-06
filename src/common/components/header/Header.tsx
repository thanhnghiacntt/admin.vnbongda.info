import * as React from "react";

/**
 * Component properties
 */
interface Properties {

  /**
   * name of this heading section
   */
  name: string;
}


/**
 * the header - showing the header of a page
 */
export class Header extends React.Component<Properties, {}> {

  /**
   * render the loader
   */
  render() {
    return (
      <div className="heading">
        <h4>
          {this.props.name}
        </h4>
      </div>
    )
  }
}