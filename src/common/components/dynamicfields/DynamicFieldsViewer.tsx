import * as React from "react";
import {TextField} from "../input/TextField";
import {Field} from "../../../models/Metadata";
import {DatePicker} from "../datepicker/DatePicker";
import {Helper} from "../../../utils/Helper";
import {Url} from "../../../utils/Url";

interface  DynamicFieldsViewerState {
  fields?: Field[]
}

interface DynamicFieldsViewerProps {
  fields?: Field[],
  onChange?: Function,
  className?: string,
  doValidation?: boolean
}

export class DynamicFieldsViewer extends React.Component<DynamicFieldsViewerProps, DynamicFieldsViewerState> {

  /**
   * render field
   * @param f
   * @returns {{}}
   */
  renderField(f: Field) {

    let type = "TextField";
    if (f == null) {
      return;
    }
    let props = {
      className: "",
      caption: f.name,
      value: f.value,
      initDate: null,
      doValidation: this.props.doValidation,
      errorMessage: null,
      validateFunc: null,
      dateformat: null,
      type: "text",
      onChange: (v)=> {
        f.value = v;
          if (f.type == "date"){
              f.value = v.getTime();
          }
      }
    };
    switch (f.type) {
      case "date" :
        props.className = "field";
        type = "DatePicker";
        props.initDate = props.value && props.value.toString().length>0? new Date(parseInt(props.value)):null;
        props.dateformat = "dd/mm/yyyy";
        break;
      case "number" :
        props.type = "number";
        break;
      case "link":
        props.errorMessage = "Website URL is invalid (Example: http://your-website.com).";
        props.validateFunc = (value)=> {
          if (!Helper.isNullOrEmpty(value))
            return Url.validate(value);
          return true;
        };
        break;
      case "string":
        break;
    }

    if (type == "DatePicker") {
      return (<DatePicker __{...props} />);
    }
    return (<TextField __{...props} />);
  }

  render() {
    return (
      <div className={this.props.className? this.props.className: "ui sixteen wide field"}>
        {
          this.props.fields.map((x, index)=> {
            return (<span key={ x.name + "_" + index}>{ this.renderField(x) }</span>)
          })
        }
      </div>);
  }
}