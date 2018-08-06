import * as React from "react";

interface InputProps {
  /**
   * Datasoucr
   */
  dataSource: any;

  /**
   * Name file id in datasource
   */
  idField: string;

  /**
   * Name file display in datasouce
   */
  displayField: string;

  /**
   * List item display
   */
  selectedItems?: any;

  /**
   * Function when change item
   */
  selectItemFunction?: Function
}

interface AutocompleteState {

  showAll?: boolean;
  /**
   * Data source display to fileter
   */
  dataSource?: any;

  /**
   * Data selected
   */
  selectedItems?: any;

  /**
   * Text input
   */
  text?: any;
}
/**
 * the loader - showing a "loading" status
 */
export class AutoComplete extends React.Component<InputProps, AutocompleteState> {
  /**
   * State
   * @type {{dataSource: any; dataSelect: any}}
   */
  state: AutocompleteState = {
    dataSource: this.props.dataSource || [],
    selectedItems: this.props.selectedItems || [],
    text: ""
  };

  /**
   * Constructor
   * @param props
   */
  constructor(props) {
    super(props);
    this.state.dataSource = this.getDataSource();
  }

  /**
   * Component will mount
   */
  componentWillReceiveProps(nextProp) {
    this.state.dataSource = this.getDataSource();
    this.state.selectedItems = nextProp.selectedItems || [];
  }

  /**
   * Render list category add
   */
  renderListCategory() {
    return this.state.selectedItems.map((value, index)=> {
      return <span key={index +"_"+ value} className="dkm-item-selected">
        <span className="dkm-item-name"
              id={value[this.props.idField]}>{value[this.props.displayField]}</span>
        <div className="atc-item-delete"
             onClick={(event)=>this.onDeleteCategorySelected(event, value[this.props.idField])}>X</div>
      </span>
    });
  }

  /**
   * Delete
   * @param event
   * @param id
   */
  removeItemOutOfList(list, id) {
    let item = null;
    let index = 0;
    for (index = 0; index < list.length; index++) {
      let value = list[index];
      if (value[this.props.idField] == id) {
        item = value;
        break;
      }
    }
    if (item != null) {
      list.splice(index, 1);
    }
    return item;
  }

  /**
   * get datasource
   */
  getDataSource() {
    let data = this.props.dataSource || [];
    let result = [];
    data.forEach((item)=> {
      this.checkItemExist(item, this.state.selectedItems, this.props.idField) != null ? "" : result.push(item)
    });
    return result;
  }

  /**
   * Check item exist in list
   * @param item
   * @param list
   * @returns if not exist return null, else return objectType
   */
  checkItemExist(item, list, field) {
    let count = list.length;
    let objectExist = null;
    for (let i = 0; i < count; i++) {
      let value = list[i];
      if (value[field] == item[field]) {
        objectExist = list[i];
        break;
      }
    }
    return objectExist;
  }

  /**
   * Render html
   * @returns {any}
   */
  render() {
    return <div className="autocomplete dkm-margin-element">
      <div className="field">
        <div onClick={(event)=>this.onClickInput(event)}>
          <div className="dkm-list-selected">
            {this.renderListCategory()}

            <input onChange={event => this.onChangeValue(event)}
                   style={{display: "inline-flex",border: 'none'}}
                   onKeyDown={event => this.keyDownInput(event)}
                   onDoubleClick={(event)=>{this.setState({showAll: !this.state.showAll});this.onChangeValue(event);}}
                   value={this.state.text}
                   placeholder="Please select"
                   className="dkm-category-input"
            />
          </div>
        </div>
        <DisplayPopupSelect dataSource={this.getDataSource()}
                            idField={this.props.idField}
                            displayField={this.props.displayField}
                            onClickFunction={(item)=>{this.onClickValue(item);this.setState({showAll: false})}}
                            showAll={this.state.showAll}
                            text={this.state.text}/>
      </div>

    </div>;
  }

  /**
   * On Click input
   * @param event
   */
  onClickInput(event) {
    $(".dkm-category-input").focus();
  }

  /**
   * Delete
   * @param event
   * @param id
   */
  onDeleteCategorySelected(event, id) {
    let item = this.removeItemOutOfList(this.state.selectedItems, id);
    if (item != null) {
      this.state.dataSource.push(item);
      this.selectItemFunction();
      this.setState({})
    }
  }

  /**
   * On Change value
   */
  onClickValue(item) {
    if (this.state.selectedItems != null) {
      this.state.selectedItems.push(item);
    } else {
      this.state.selectedItems = [item];
    }
    this.removeItemOutOfList(this.state.dataSource, item[this.props.idField]);
    this.selectItemFunction();
    this.setState({text: ""});
  }

  /**
   * Action select or delete item
   */
  selectItemFunction() {
    if (this.props.selectItemFunction != null) {
      this.props.selectItemFunction(this.state.selectedItems);
    }
  }

  /**
   * Key down
   * @param event
   */
  keyDownInput(event) {
    let item = null;
    switch (event.keyCode) {
      // Key enter
      case 13:
        let text = this.state.text;
        let itemSelect = $(".dkm-popup-categories .dkm-popup-item-active");
        let id = $(".dkm-popup-categories .dkm-popup-item-active").attr("id");
        if (itemSelect.length > 0) {
          text = itemSelect.html();
        }
        let data = this.getDataSource();
        item = {};
        item[this.props.displayField] = text;
        item[this.props.idField] = id;
        let objectExist = this.checkItemExist(item, data, this.props.idField);
        if (objectExist != null) {
          this.state.selectedItems.push(objectExist);
          this.removeItemOutOfList(this.state.dataSource, objectExist[this.props.idField]);
          this.selectItemFunction();
          this.setState({text: ""});
        }
        break;
      // Key arrow down
      case 40:
        item = $(".dkm-popup-categories .dkm-popup-item-active").next();
        $(".dkm-popup-categories .dkm-popup-item").removeClass("dkm-popup-item-active");
        if (item.length == 0) {
          $(".dkm-popup-categories .dkm-popup-item").first().addClass("dkm-popup-item-active");
        } else {
          item.addClass("dkm-popup-item-active");
        }
        break;
      // Key arrow up
      case 38:
        item = $(".dkm-popup-categories .dkm-popup-item-active").prev();
        $(".dkm-popup-categories .dkm-popup-item").removeClass("dkm-popup-item-active");
        if (item.length == 0) {
          $(".dkm-popup-categories .dkm-popup-item").last().addClass("dkm-popup-item-active");
        } else {
          item.addClass("dkm-popup-item-active");
        }
        break;
      // Key delete
      case 8:
        if (this.state.text.length == 0) {
          let id = $(".dkm-item-selected .dkm-item-name").last().attr("id");
          if (id != null && id.trim().length > 0) {
            this.onDeleteCategorySelected(event, id);
          }
        }
        break;
    }
  }

  /**
   * On Change value
   */
  onChangeValue(event) {
    this.setState({text: event.target.value});
  }
}

interface DataDisplayProp {
  /**
   * Datasoucr
   */
  dataSource: any;

  /**
   * Name file id in datasource
   */
  idField: string;

  /**
   * Name file display in datasouce
   */
  displayField: string;

  /**
   * On click name
   */
  onClickFunction: Function;

  /**
   * Text search
   */
  text: any;

  showAll?: boolean;
}

class DisplayPopupSelect extends React.Component<DataDisplayProp, {}> {
  /**
   * Id filed
   * @type {string}
   */
  idField: string = this.props.idField;

  /**
   * Display field
   * @type {string}
   */
  displayField: string = this.props.displayField;

  /**
   * Render
   * @returns {any}
   */
  render() {
    let dataFiltered = this.filter(this.props.dataSource, this.props.displayField, this.props.text);
    return <div className="dkm-popup-categories">
      {dataFiltered.map((item, index) => {
        return <div onClick={(event)=>this.onClickPopup(event, item)}
                    key={index+ "_" + item.value}
                    id={item[this.props.idField]}
                    onMouseOver={(event)=>this.onMouseOver(event, item)}
                    onMouseLeave={(event)=>this.onMouseLeave(event, item)}
                    className="dkm-popup-item">{item[this.props.displayField]}
        </div>
      })}
    </div>
  }

  /**
   * On Click popup
   */
  onClickPopup(event, item) {
    if (this.props.onClickFunction != null) {
      this.props.onClickFunction(item);
    }
  }

  /**
   * On Mouse Over
   * @param item
   */
  onMouseLeave(event, item) {
    $(".dkm-popup-categories div").removeClass("dkm-popup-item-active");
  }

  /**
   * On Mouse Over
   * @param item
   */
  onMouseOver(event, item) {
    $(".dkm-popup-categories div").removeClass("dkm-popup-item-active");
    let list = $(".dkm-popup-categories div");
    list.each((index, element) => {
      if (element.id == item[this.props.idField]) {
        $(element).addClass("dkm-popup-item-active");
      }
    })
  }

  /**
   * Fielter
   * @param first
   * @param fieldFilter
   * @param text
   * @returns {any}
   */
  filter(first, fieldFilter, text) {
    let result = first.filter((item) => {
      let value = item[fieldFilter].toLocaleLowerCase();
      let needFielter = text.toLocaleLowerCase().trim();
      if (needFielter.length == 0) {
        if (this.props.showAll)
          return item;
        return false;
      }
      let reg = this.createRegExp(needFielter);
      return reg.test(value);
    });
    return result;
  }

  /**
   * Create expression
   * @param text
   * @returns {RegExp}
   */
  createRegExp(text) {
    let array = ["(a|à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)", "(i|ì|í|ị|ỉ|ĩ)", "(u|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)", "(d|đ)",
      "(e|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)", "(o|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)", "(y|ỳ|ý|ỵ|ỷ|ỹ)"];
    let result = "";
    for (let index = 0; index < text.length; index++) {
      let charector = text[index];
      let isNotContent = true;
      for (let i = 0; i < array.length; i++) {
        let value = array[i];
        if (value.indexOf(charector) > -1) {
          result += value;
          isNotContent = false;
          break;
        }
      }
      if (isNotContent) {
        result += charector;
      }
    }
    return new RegExp(result);
  }
}