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

  /**
   * data to display
   */
  data: any;
  isLoading: boolean;
}

/**
 * the grid header
 */
export class GridBody extends React.Component<Properties, {}> {

  /**
   * render the grid header
   */
  render() {
    return (
      <tbody>
      {this.props.data && this.props.data.length ? (
        this.props.data.map((item, rowIndex) => (
          <tr key={rowIndex}>
            {this.props.columns.map((column, columnIndex) => (
              <td style={{textAlign:column.props.textAlign}} key={columnIndex}>
                {
                  column.props.renderer ? (
                    column.props.renderer(item, column.props.name, rowIndex)
                  ) : (
                    item[column.props.name]
                  )
                }
              </td>
            ))}
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={this.props.columns.length}
              style={{"textAlign": "center",display:this.props.isLoading?"none":""}}>
            <div><i className="huge frown icon"/></div>
            <div>No data found.</div>
          </td>
        </tr>
      )}
      </tbody>
    )
  }
}