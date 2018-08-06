import * as React from "react";

/**
 * Check box field props
 */
interface CheckBoxFieldProps{
  value?: boolean;
  name: string;
  onClick?: Function;
  disabled?: boolean;
}
/**
 * Check box field state
 */
interface CheckBoxFieldState{
  value?: boolean;
}
/**
 * Check box field class
 */
export class CheckBoxField extends React.Component<CheckBoxFieldProps, CheckBoxFieldState> {
  /**
   * Initial
   * @type {{value: boolean}}
   */
  state: CheckBoxFieldState = {
    value : this.props.value
  };

  /**
   * Component will receive props
   */
  componentWillReceiveProps(){
    this.state.value = this.props.value;
  }

  /**
   * Render html
   * @returns {any}
   */
  render(){
    return <div className="field">
      <label>{this.props.name}</label>
      <input
        defaultChecked={this.state.value}
        disabled={this.props.disabled}
        onChange={(event)=>{this.onChange();}} type="checkbox"/>
    </div>;
  }

  /**
   * On change value
   */
  onChange(){
    if(this.props.onClick != null){
      this.props.onClick(!this.state.value);
    }
    this.setState({});
  }
}