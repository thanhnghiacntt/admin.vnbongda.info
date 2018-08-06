import * as React from "react";
import {Helper} from "../../../utils/Helper";

/**
 * Component properties
 */
interface TextFieldProps {

  ref?: Function,

  placeholder?: string,

  /**
   * caption of the text field
   */
  caption: string;

  /**
   * value of the text field
   */
  value: any;

  /**
   * class name
   */
  className?: string;

  /**
   * handle on change
   */
  onChange?: (data: string, value?: string) => any;

  /**
   * type
   */
  type?: string;

  /**
   * step
   */
  step?: number;

  /**
   * max length input, if not input default -1
   */
  maxLength?: number;

  /**
   * error message
   */
  errorMessage?: string;

  /**
   * Name
   */
  name?: string;

  /**
   * Required field
   */
  isRequired?: boolean;

  /**
   * do valid
   */
  doValidation?: boolean;

  validateFunc?: Function;

  /**
   * Key
   */
  key?: string;

  numberRow?: number,

  numberCol?: number,

  readOnly?: any,

  /**
   * handle key down
   */
  onKeyDown?: Function;

  onBlur?: Function;

  min?: any;

  max?: any;

}

interface TextEditorState {

  errorVisible?: boolean,

  errorMessage?: string,

  value?: any,

  valid?: boolean,

  errorClass?: string

}


/**
 * the header - showing the header of a page
 */
export class TextField extends React.Component<TextFieldProps, TextEditorState> {
  init = true;
  htmlInput: HTMLInputElement;
  state: TextEditorState = {
    errorVisible: false,
    errorMessage: ''
  };

  /**
   * Handle on text change event
   */
  private onTextChange(event) {
    let valid = true;
    if (this.props.doValidation) {
      let valid = this.valid;
    }
    if (this.props.onChange)
      this.props.onChange(event.target.value);
    return valid;
  }

  isNullOrEmpty(value: string) {
    return value == null || value == "";
  }

  /**
   * valid
   */
  public get valid() {
    var errorClass = "ui red message";
    if (this.props.isRequired && ( Helper.isNullOrEmpty(this.htmlInput.value))) {
      this.setState({
        errorMessage: "The " + this.props.name + " field is required.",
        errorClass: "required",
        errorVisible: true
      });
    } else if (this.props.validateFunc && !this.props.validateFunc(this.htmlInput.value)
    ) {
      this.setState({
        errorMessage: this.props.errorMessage,
        errorVisible: true
      });
      return false;
    }
    else {
      this.setState({errorVisible: false});
      return true;
    }
  }

  componentWillReceiveProps(nextProps) {
    //
    //init value
    //
    this.setState({value: nextProps.value}, () => {
      this.htmlInput.value = this.state.value || "";
      this.init = false;
      if (this.state.value === 0)
        this.htmlInput.value = "0";
    });

    if (nextProps && nextProps.doValidation) {
      let valid = this.valid;
      return valid;
    }
  }

  /**
   * component did mount
   */
  componentDidMount() {
    this.htmlInput.value = this.props.value || "";
  }

  /**
   * render the loader
   */
  render() {
    return (
      <div ref={(c => {
        if (this.props.ref) this.props.ref(c)
      })}
           className={(this.props.className ? this.props.className : "field") + (this.state.errorVisible ? " error" : "")}>
        <label>{this.props.caption}</label>
        <div className="ui input">
          <input
            step={this.props.step != 0 ? this.props.step : ""}
            type={this.props.type != undefined && this.props.type != "" ? this.props.type : "text"}
            min={this.props.min || null}
            max={this.props.max || null}
            ref={(input) => {
              this.htmlInput = input;
            }}
            placeholder={this.props.placeholder ? this.props.placeholder : this.props.caption}
            className={this.state.valid ? "" : "error"}
            maxLength={this.props.maxLength > 0 ? this.props.maxLength : 9999}
            name={this.props.name}
            readOnly={this.props.readOnly}
            onKeyDown={(e) => {
              this.props.onKeyDown ? this.props.onKeyDown(e) : () => {
              }
            }}
            onBlur={(e) => {
              if (this.props.onBlur) this.props.onBlur(e.target["value"], e);
            }}
            onChange={event => {
              this.onTextChange(event)
            }}/>

        </div>
        {
          this.state.errorVisible ?
            <div
              className={"ui basic red pointing prompt label transition " + (this.state.errorVisible ? "visible" : "")}>
              {Helper.isNullOrEmpty(this.state.errorMessage) && !this.state.errorVisible ? "hidden" : this.state.errorMessage}</div> : null
        }
      </div>
    )
  }
}