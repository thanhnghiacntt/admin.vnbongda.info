/**
 * Created by nghiant on 8/29/2016.
 */
import * as React from "react";

interface IMenu {
  children?: any;
  className?: string;
}

export default class Menu extends React.Component<{}, {}> {
  /**
   * Props
   */
  props: IMenu;

  /**
   * Constructor
   */
  constructor(props) {
    super(props);
    this.props = props;
  }


  /**
   * Render html of menu
   */
  render() {

    return <div className="ui vertical menu">
      {this.props.children}
    </div >
  }
}