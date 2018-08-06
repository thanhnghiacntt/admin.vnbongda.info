import * as React from "react";


/**
 * grid header properties
 */
interface State {

  /**
   * list of columns
   */
  totalItems: number;

  /**
   * current page
   */
  currentPage: number;

  /**
   * item per page
   */
  itemsPerPage: number;
}

/**
 * the props
 */
interface Props extends State {

  /**
   * on change
   * @param currentPage current selected page
   * @param itemPerPage items per page
   */
  onChange?: (currentPage: number, itemPerPage: number) => void;
  maxPagesDisplay?: number;
}

/**
 * the grid header
 */
export class Pagination extends React.Component<Props, {}> {

  /**
   * select page
   */
  selectPage(page: number) {
    if (this.props.onChange) {
      this.props.onChange(page, this.props.itemsPerPage);
    }
  }

  /**
   * get total pages
   * @return {number}
   */
  get totalPages() {
    return Math.ceil(this.props.totalItems / this.props.itemsPerPage);
  }

  /**
   * get pages items
   */
  get pages() {
    const totalPages = this.totalPages;
    let maxPagesDisplay = this.props.maxPagesDisplay;
    if (maxPagesDisplay == undefined || maxPagesDisplay == 0) {
      maxPagesDisplay = 6;
    }
    const pages = [];
    if (totalPages <= maxPagesDisplay) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(
          <a key={i}
             className={i == this.props.currentPage ? "active item" : "item"}
             onClick={() => this.selectPage(i)}>
            {i + 1}
          </a>
        )
      }
    } else if (this.props.currentPage < maxPagesDisplay / 2)  //case total page > && current page <maxPagesDisplay/2
    {
      for (let i = 0; i < maxPagesDisplay / 2 + 1; i++) {
        pages.push(
          <a key={i}
             className={i == this.props.currentPage ? "active item" : "item"}
             onClick={() => this.selectPage(i)}>
            {i + 1}
          </a>
        );
      }
      //push ...
      pages.push(
        <a key={maxPagesDisplay/2+1}
           className={"item"}
           onClick={() =>{}}>
          {"..."}
        </a>);
      //push last page
      pages.push(
        <a key={totalPages-1}
           className={totalPages-1 == this.props.currentPage ? "active item" : "item"}
           onClick={() => this.selectPage(totalPages-1)}>
          {totalPages}
        </a>
      );
    }
    else if (this.props.currentPage > totalPages - (maxPagesDisplay / 2 + 1)) //case total page > && current page >totalPages - maxPagesDisplay/2
    {
      //push first page
      pages.push(
        <a key={0}
           className={0 == this.props.currentPage ? "active item" : "item"}
           onClick={() => this.selectPage(0)}>
          {1}
        </a>
      );
      //push ...
      pages.push(
        <a key={1}
           className={"item"}
           onClick={() =>{}}>
          {"..."}
        </a>);
      for (let i = totalPages - (maxPagesDisplay / 2 + 1); i < totalPages; i++) {
        pages.push(
          <a key={i}
             className={i == this.props.currentPage ? "active item" : "item"}
             onClick={() => this.selectPage(i)}>
            {i + 1}
          </a>
        );
      }
    } else {
      //push first page
      pages.push(
        <a key={0}
           className={0 == this.props.currentPage ? "active item" : "item"}
           onClick={() => this.selectPage(0)}>
          {1}
        </a>
      );
      //push ...
      pages.push(
        <a key={1}
           className={"item"}
           onClick={() =>{}}>
          {"..."}
        </a>);
      for (let i = this.props.currentPage - 1; i < this.props.currentPage + 2; i++) {
        pages.push(
          <a key={i}
             className={i == this.props.currentPage ? "active item" : "item"}
             onClick={() => this.selectPage(i)}>
            {i + 1}
          </a>
        );
      }
      //push ...
      pages.push(
        <a key={-2}
           className={"item"}
           onClick={() =>{}}>
          {"..."}
        </a>);
      //push last page
      pages.push(
        <a key={totalPages-1}
           className={totalPages-1 == this.props.currentPage ? "active item" : "item"}
           onClick={() => this.selectPage(totalPages-1)}>
          {totalPages}
        </a>
      );
    }
    return pages;
  }

  /**
   * render the grid header
   */
  render() {
    return (
      <div className="ui floated right tiny pagination menu" style={{display:this.totalPages==0? "none":""}}>
        <a className="icon item"
           style={this.props.currentPage == 0 ? {display: 'none'} : {}}
           onClick={() => this.selectPage(this.props.currentPage - 1)}>
          <i className="left chevron icon"/>
        </a>
        {this.pages}
        <a className="icon item"
           style={this.props.currentPage == this.totalPages - 1 ? {display: 'none'} : {}}
           onClick={() => this.selectPage(this.props.currentPage + 1)}>
          <i className="right chevron icon"/>
        </a>
      </div>
    )
  }
}