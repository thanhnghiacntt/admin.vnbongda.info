/**
 * Created by dungdh on 15/2/2017.
 */

import * as React from 'react';
import {Category} from "../../models/Category";
import {CategoryService} from "../../services/CategoryService";
import TreeView from "../../common/components/treeview/TreeView";
import {NodeData} from "../../common/components/treeview/TreeNode";
import {TextField} from "../../common/components/input/TextField";
import {ColorsPicker} from "../../common/components/colorpicker/ColorsPicker";
import {IconImage} from "../../common/components/canvasimage/IconImage";
import {Helper} from "../../utils/Helper";
import {Link} from "react-router-dom"
import {Menu} from "semantic-ui-react";
import {Dialog, DialogType} from "../../common/components/dialog/Dialog";
import {Spinner} from "../../common/components/loader/Spinner";
import {ResponseCode} from "../../common/network/ResponseCode";
import {CheckBoxField} from "../../common/components/checkbox/CheckBoxField";

/**
 * Map State
 */
interface CategoriesState {
  categories?: Category[],
  totalCats?: number,
  query?: string,
  currentPage?: number,
  errorMessage?: string,
  treeNode?: NodeData[],
  currentNode?: NodeData,
  slug?: string
}


/**
 * Map properties
 */
interface CategoriesProperties {

}

/**
 * the dash board
 */
export default class Categories extends React.Component<CategoriesProperties, CategoriesState> {

  /**
   * Init state
   */
  state: CategoriesState = {
    categories: [],
    treeNode: [],
  };


  /**
   * CategoryService
   */
  private categoryService = new CategoryService();

  /**
   * Load child data
   * @param page
   * @param itemsPerPage
   */
  async getChildData(id: string): Promise<NodeData[]> {
    Spinner.show(true);
    let response = await this.categoryService.getChildren(id);
    let data = response.data;
    let nodes = [];
    data.map((node) => {
      nodes.push({
        tag: node,
        id: node.id,
        text: node.name,
        children: [],
        description: node.description
      });
    });
    Spinner.show(false);
    return nodes;
  }

  async loadCategories() {
    try {
      Spinner.show(true);
      this.setState({treeNode: []});
      let nodes = await this.getChildData("");

      this.setState({
        treeNode: nodes
      });
      Spinner.show(false);
    } catch (error) {
      Dialog.show("Error Message", "Couldn't load categories.");
    }
  }

  /**
   * delete cat
   */
  async deleteCategory(id: string, text: string) {
    let message = "Are you sure to delete the \"" + this.state.currentNode.text + "\" category?"
    let confirm = await Dialog.show("Confirm message", message, DialogType.YesNo);
    if (confirm) {
      Spinner.show(true);
      let response = await this.categoryService.delCategoryById(id);
      // handle case in using
      if (response.code == ResponseCode.deleteReference) {
        message = "This category is currently in use, Are you sure you want to delete this category?"
        let confirm = await  Dialog.show("Confirm message", message, DialogType.YesNo);
        if (confirm) {
          this.forceDeleteCategory(id, text);
        }
        return;
      }
      this.setState({
        currentNode: null
      });
      message = "The \"" + text + "\" category has been deleted successfully."
      Spinner.show(true);
      await  Dialog.show("Information message", message);
      let cats: NodeData[] = [];
      this.state.treeNode.forEach((c) => {
        if (c.id != id) {
          cats.push(c);
        }
      });
      this.setState({treeNode: cats});
      /**
       * reload tree
       */
      this.loadCategories()
    }
  }

  /**
   * force delete cat
   */
  async forceDeleteCategory(id: string, text: string) {
    Spinner.show(true)
    await this.categoryService.forceDelCategoryById(id);
    this.setState({
      currentNode: null
    });
    let message = "The \"" + text + "\" category has been forced to delete successfully.";
    await Dialog.show("Information message", message);
    let cats: NodeData[] = [];
    this.state.treeNode.forEach((c) => {
      if (c.id != id) {
        cats.push(c);
      }
    });
    this.setState({treeNode: cats});

    /**
     * reload tree
     */
    this.loadCategories()
  }


  /**
   * Component did mount
   */
  componentDidMount() {
    /**
     * set title
     *
     */
    Helper.setPageTitle("Category");
    this.loadCategories()
  }

  /**
   * Render Menu
   */
  renderMenu() {
    let btnBlur = true;
    if (this.state.currentNode) {
      btnBlur = false;
    }
    if (!this.state.treeNode || this.state.treeNode.length == 0) {
      return <div/>;
    }
    return (
      <Menu>
        <Menu.Menu>
          <Menu.Item>
            <Link to="/category/edit" className="ui primary btn-create icon button small">
              <span>Create New</span>
            </Link>
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu position='right'>
          <Menu.Item>
            {this.state.currentNode != null ?
              <Link {...{disabled: btnBlur, to: '/category/edit/' + this.state.currentNode.id}}
                    className="ui primary icon button small">
                <i className="edit icon"/>Edit
              </Link>
              : ""}
          </Menu.Item>
          <Menu.Item>
            <button disabled={btnBlur} className="ui red basic icon button small" onClick={() => {
              this.deleteCategory(this.state.currentNode.id, this.state.currentNode.text)
            }}>
              <i className="delete icon"/>
              Delete
            </button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }

  /**
   * render view
   */
  render() {
    let node = this.state.currentNode;
    let slug = node && node.tag && (node.tag as Category).slug ? (node.tag as Category).slug : "";
    let cat: Category = node && node.tag ? node.tag as Category : {};

    return (
      <div className="category-management">
        <div className="ui blurring content-box map-setting-form">
          {
            this.renderMenu()
          }
          <div className="ui grid form">
            <div className="five wide column">
              <div className="field">
                <TreeView
                  dataSource={this.state.treeNode}
                  treeViewId="category-tree"
                  onTreeNodeClick={(d) => {
                    this.setState({currentNode: d});
                  }}
                  loadChildData={async (data): Promise<NodeData[]> => {
                    return this.getChildData(data.id);
                  }}/>
              </div>
            </div>
            {
              this.state.currentNode ?
                <div className="eleven wide column">
                  <h2>Information</h2>
                  <div className="ui form">
                    <TextField caption="Name"
                               value={this.state.currentNode.text}
                               readOnly={"readOnly"}
                               onChange={(value) => {
                               }}/>
                    <TextField caption="Description"
                               value={this.state.currentNode.description}
                               readOnly={"readOnly"}
                               type={"textarea"}
                               onChange={(value) => {
                               }}/>
                    <TextField caption="Slug"
                               value={slug}
                               readOnly={"readOnly"}
                               type={"textarea"}
                               onChange={(value) => {
                               }}/>
                    <TextField caption="Order by"
                               value={cat.orderBy || "N/A"}
                               isRequired={true}
                               readOnly={"readOnly"}
                               onChange={(value) => {
                               }}/>
                  </div>
                </div> : null
            }
          </div>
        </div>
      </div>
    );
  }
}