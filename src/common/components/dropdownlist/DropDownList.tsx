import * as React from "react";
import {Helper} from "../../../utils/Helper";
import {Dropdown} from 'semantic-ui-react'

export interface DropDownListOption {
  text?: string,
  value?: string,
  tag?: any
}

/**
 * state of the UserPage
 */
interface State {

  errorVisible?: boolean,
  errorClass?: string;
  errorMessage?: string
}

export interface DropDownListProps {
  label?: string,
  initValue?: any,
  data?: DropDownListOption[]
  onChange?: Function,
  defaultValue?: any,
  className?: string,
  width?: number,
  textLength?: number,
  disabled?: boolean,
  name?: string,
  errorMessage?: string,
  isRequired?: boolean,
  doValidation?: boolean,
}
/**
 * unique hash
 * @type {string}
 */
const emptyDataOptionDefault = "@__empty__@_582594d3afaa6a101c47fd21";

export default class DropDownList extends React.Component<DropDownListProps, State> {
  private selectedValue = "";
  state: State = {
    errorMessage: ".",
    errorVisible: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.doValidation) {
      if (this.props.isRequired && Helper.isNullOrEmpty(this.selectedValue || this.props.defaultValue)) {
        this.setState({errorVisible: true, errorMessage: "The " + this.props.name + " field is required."})
      } else {
        this.setState({errorVisible: false});
      }
    }
  }

  componentDidMount() {
    this.selectedValue = this.props.defaultValue;
  }

  onDropdownItemChange(event, data) {
    let props = this.props;
    let context = this;
    if (props.onChange && context.selectedValue != data.value) {
      data.value = data.value == emptyDataOptionDefault ? "" : data.value;
      this.selectedValue = data.value;
      if (!Helper.isNullOrEmpty(data.value)) {
        this.setState({errorVisible: false});
      } else if (props.isRequired && props.doValidation) {
        this.setState({errorVisible: true});
      }
      props.onChange(data.value);
      this.setState({});
    }
  }

  render() {
    let options = this.props.data || [];
    options.map(x=> {
      if (Helper.isNullOrEmpty(x.value))
        x.value = emptyDataOptionDefault;
    });
    return (
      <div
        className={"field "+(this.state.errorVisible?" error ":"") + (this.props.className?this.props.className : " ")}>
        <label> {this.props.label} </label>
        <Dropdown
          error={this.state.errorVisible}
          value={this.props.defaultValue || emptyDataOptionDefault}
          disabled={this.props.disabled}
          onChange={(event, data)=>this.onDropdownItemChange(event, data)}
          placeholder={this.props.label}
          fluid selection options={options}/>
        {this.state.errorVisible ?
          <div className={"ui basic red pointing prompt label transition "+(this.state.errorVisible?"visible":"")}>
            {this.state.errorMessage}</div> : null
        }
      </div>
    )
  }
}