/**
 * Created by nghiant on 05/10/2016.
 */
import * as React from 'react';

/**
 * the group caption and input
 */
export default class Group extends React.Component<{}, {}> {
 
  props : any;
  /**
   * Constructor
   */
  constructor(props) {
    super(props);
    this.props = props;
    if(props.inputType == null || props.inputType == ""){
      props.inputType = "text";
    }
  };

/**
 * Render html
 */
  render() {
    return (
      <div className="field">
        <label>{this.props.labelName}</label>
        <input type={this.props.inputType} placeholder={this.props.inputPlaceholder} className="form-control" name={this.props.inputName} id={this.props.inputId}/>
      </div>
    );
  };
}