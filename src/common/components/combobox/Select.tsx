import * as React from "react";
import {ComboBoxItem} from "../../utils/ComboBoxItem";

/**
 * Component properties
 */
interface Properties {

  /**
   * caption of the text field
   */
  caption: string;

  /**
   * data of the text field
   */
  items: ComboBoxItem[];

  /**
   * selected value of combo box
   */
  selectedValue?: string;

  /**
   * id of combo box
   */
  id?: string;

  /**
   * name of combo box
   */
  name?: string;

  /**
   * handle on change
   */
  onChange(value: string);
}


/**
 * the header - showing the header of a page
 */
export class Select extends React.Component<Properties, {}> {

  /**
   * Handle on text change event
   */
  private onChange(event) {
    this.props.onChange(event.target.value);
  }

  /**
   * render the loader
   */
  render() {
    return (
      <div className="field">
        <label>{this.props.caption}</label>
        <select name={this.props.name} id={this.props.id} value={this.props.selectedValue? this.props.selectedValue: ""}
                className="ui dropdown"
                onChange={event => this.onChange(event)}>
          {
            this.props.items ?
              this.props.items.map(x => {
                return (<option key={x.key} value={x.key}>{x.value}</option>)
              }) : ""
          }
        </select>
      </div>
    )
  }


}