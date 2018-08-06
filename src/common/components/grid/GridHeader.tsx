import {Column} from "./Column";
import * as React from "react";
/**
 * grid header properties
 */
interface Properties {

  /**
   * list of columns
   */
  columns: Column[];
}

/**
 * the grid header
 */
export class GridHeader extends React.Component<Properties, {}> {

  /**
   * render the grid header
   */
  render() {
    return (
      <thead>
      <tr style={{
          backgroundColor: "#e1ecf4",borderColor: "#e1ecf4"}}>
        {this.props.columns.map((column, columnIndex) => (
          <th style={{
          color: "#293f54",
          fontWeight:"600",
          background:"transparent",
          width: column.props.width!=""? column.props.width: 'auto',
          textAlign:"center"}} key={columnIndex}>{
            column.props.headerRenderer ? column.props.headerRenderer():
              (column.props.header || column.props.displayName)
          }</th>
        ))}
      </tr>
      </thead>
    )
  }
}