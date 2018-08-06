import * as React from "react";
/**
 * column property
 */
interface ColumnProps {

  /**
   * key of the column
   */
  key?: any;

  /**
   * name of the column
   */
  name: string;

  /**
   * display name
   */
  displayName: string;

  /**
   * custom renderer
   */
  renderer?: (item: any, field: string, index: number) => any

  /**
   * header of the column
   */
  header?: any,

  /**
   * column width
   */
  width?: string,

  /**
   * text align
   */
  textAlign?: string,

  headerRenderer?: Function

}

/**
 * column of grid
 */
export class Column extends React.Component<ColumnProps, {}> {
}