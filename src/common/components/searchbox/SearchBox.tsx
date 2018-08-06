import * as React from "react";

/**
 * Component properties
 */
interface Properties {

  /**
   * value of the text box
   */
  value?: string;


  /**
   * Handle the query change
   */
  onChange: (string) => void;

  onEnter?: Function;

  style?: {};
}


/**
 * Show the text box for searching
 */
export class SearchBox extends React.Component<Properties, {}> {

  /**
   * handle query did change
   * @param event the event
   */
  private queryDidChanged(event) {
    this.props.onChange(event.target.value);
  }

  /**
   * render the search box
   */
  render() {
    return (
      <div className="ui icon input" style={this.props.style?this.props.style:{}}>
        <i onClick={()=>{if(this.props.onEnter) this.props.onEnter();}} className="search link icon"/>
        <input type="text"
               placeholder="Search..."
               value={this.props.value}
               onKeyDown = {(event)=>{
                              if(event.keyCode == 13 && this.props.onEnter)
                                {
                                    this.props.onEnter();
                                }
                              }
                          }
               onChange={(event) => this.queryDidChanged(event)}/>
      </div>
    )
  }
}