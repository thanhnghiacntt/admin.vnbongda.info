/**
 * Created by nghiant on 8/29/2016.
 */
import * as React from "react";
import {NavLink} from 'react-router-dom'

/**
 * Interface group of li tag
 */
interface Properties {
  /**
   * To GroupLink
   */
  linkTo: string;

  /**
   * Text to display
   */
  text: string;

  /**
   * icon to display
   */
  icon?: string;

  /**
   * Load url
   */
  isLoadURL?: boolean;

  className?: string;

  hasSubMenu?: boolean;
}

/**
 * Item state
 */
interface ItemState {
  viewChild?: boolean
}

/**
 * menu item
 */
export default class Item extends React.Component<Properties, ItemState> {

  viewChild: boolean;

  constructor() {
    super();
    this.state = {
      viewChild: true
    };
    this.viewChild = true;
  }

  /**
   * Render html
   */
  render() {
    return (
      <div>
        <NavLink to={this.props.linkTo}
              onClick={()=>{ this.viewChild=!this.state.viewChild ;this.setState({viewChild: this.viewChild}); document[this.props.text+"Page"] = 0;}}
              className={"item " + (this.state.viewChild ? "visible" : "invisible")}
              style={{paddingRight: "3px",whiteSpace:'normal'}}
              activeClassName="active">
          {this.props.icon ? (<i className={this.props.icon + " icon"} title={this.props.text}/>) : null}
          <span className="child-icon" title={this.props.text}/> <span className="caption">{this.props.text}</span>
          {this.props.hasSubMenu ?<i style={{float:"right",marginRight:"6px"}} className="triangle down icon"/>: ""}
        </NavLink>
        <div className={"child"}
             style={{display: this.state.viewChild ? "block" : "none"}}>
          {this.props.children}
        </div>
      </div>
    );
  }
}