import * as React from "react";

/**
 * Component properties
 */
interface Properties {

  /**
   * selected button index
   */
  selectedIndex: number;

  /**
   * titles of buttons
   */
  titles: string[];

  /**
   * handle on change
   */
  onChange(selectedIndex: number);
}


/**
 * the segment buttons
 */
export class SegmentButton extends React.Component<Properties, {}> {

  /**
   * render the loader
   */
  render() {
    return (
      <div className="ui buttons buildings-filter">
        {this.props.titles.map((title: string, index: number) => (
          <button
            key={index}
            onClick={() => this.props.onChange(index)}
            className={"ui button " + (this.props.selectedIndex == index ? "active": "")}>
            {title}
          </button>
        ))}
      </div>
    )
  }
}