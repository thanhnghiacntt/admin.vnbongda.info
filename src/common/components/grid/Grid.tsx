import * as React from "react";
import {Column} from "./Column";
import {GridHeader} from "./GridHeader";
import {GridBody} from "./GridBody";
import {Pagination} from "./Pagination";
import {Loader} from "../loader/Loader";

/**
 * properties for the grid view
 */
interface Properties {

  /**
   * data to feed the grid
   */
  data: any[];

  /**
   *
   * on page changed
   *
   * @param currentPage the selected page
   * @param itemPerPage total items
   */
  onPageChanged?: (currentPage, itemPerPage) => void;

  /**
   * total items
   */
  totalItems: number;

  /**
   * items per page
   */
  itemsPerPage?: number;

  /**
   * the current page
   */
  currentPage?: number;

  /**
   * is grid loading
   */
  isLoading?: boolean;

  /**
   * class name
   */
  className?: string;
}

/**
 * state of the component
 */
interface State {

}

/**
 * the grid view components
 */
export class Grid extends React.Component<Properties, State> {


  /**
   * call when component did mount
   */
  componentDidMount() {
  }

  /**
   * get list of columns
   */
  get columns() {

    let result: Column[] = [];

    if (this.props.children) {
      if (this.props.children["length"]) {
        for (const item of this.props.children as any[]) {
          if (item.length) {
            result = result.concat(item);
          } else {
            result.push(item);
          }
        }
      } else {
        result.push(this.props.children as Column);
      }
    }

    return result;
  }

  /**
   * render the grid view
   */
  render() {
    const columns = this.columns;

    return (
      <div style={{position: "relative"}} className={this.props.className?this.props.className: ""}>
        <Loader isLoading={this.props.isLoading}/>
        <table className="ui celled compact striped table table-grid">
          <GridHeader columns={columns}/>
          <GridBody isLoading={this.props.isLoading} columns={columns} data={this.props.data}/>
          <tfoot>
          <tr>
            <th colSpan={columns.length}>
              <Pagination totalItems={this.props.totalItems}
                          itemsPerPage={this.props.itemsPerPage}
                          currentPage={this.props.currentPage}
                          onChange={this.props.onPageChanged}/>
            </th>
          </tr>
          </tfoot>
        </table>
      </div>
    )
  }
}
