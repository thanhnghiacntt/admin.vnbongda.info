import * as React from "react";

/**
 * Component properties
 */
interface Properties {

  /**
   * display is loading
   */
  isLoading: boolean;
}


/**
 * the loader - showing a "loading" status
 */
export class Loader extends React.Component<Properties, {}> {

  /**
   * render the loader
   */
  render() {
    return (
      <div className={this.props.isLoading ? "ui active inverted dimmer" : "ui dimmer"} style={{position:"fixed"}}>
        <div className="ui large loader"></div>
      </div>
    )
  }
}