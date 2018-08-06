import * as React from "react";

interface InputProps{
  /**
   * Class name
   */
  className?: string;

  /**
   * Placeholder
   */
  placeholder?: string;

  /**
   * Type input
   */
    type: string;

  /**
   * Event on change
   */
  onChange: Function;

  /**
   * Event on key press
   */
  onKeyPress?: Function;

  /**
   * Auto focus
   */
  autoFocus?: boolean;
}

export class Input extends React.Component<InputProps,{}> {

  nameInput: any;

  /**
   * Did mount component
   */
  componentDidMount(){
    if(this.props.autoFocus){
      this.nameInput.focus();
    }
  }

  /**
   * Render html
   * @returns {any}
   */
  render(){
    return (<div className="dkm-input">
      <input type={this.props.type}
             className={this.props.className}
             ref={(input) => {this.nameInput=input}}
             placeholder={this.props.placeholder}
             onKeyPress={(event)=>{this.props.onKeyPress != null ? this.props.onKeyPress(event):null}}
             onChange={(event)=>this.props.onChange(event)}
      />
    </div>);
  }
}