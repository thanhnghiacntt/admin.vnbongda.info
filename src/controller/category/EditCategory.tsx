/**
 * Created by dungdh on 15/2/2017.
 */

import * as React from 'react';
import {TextField} from "../../common/components/input/TextField";
import {Helper} from "../../utils/Helper";
import {CategoryService} from "../../services/CategoryService";
import {Category, categoryResponseCode} from "../../models/Category";
import {match, Redirect} from 'react-router';
import {ComboBoxItem} from "../common/utils/ComboBoxItem";
import TreeView from "../../common/components/treeview/TreeView";
import {NodeData} from "../../common/components/treeview/TreeNode";
import {ColorsPicker} from "../../common/components/colorpicker/ColorsPicker";
import {IconImage} from "../../common/components/canvasimage/IconImage";
import {TextArea} from "../../common/components/input/TextArea";
import {Menu} from "semantic-ui-react"
import {Spinner} from "../../common/components/loader/Spinner";
import {Dialog, DialogType} from "../../common/components/dialog/Dialog";
import DropDownList from "../../common/components/dropdownlist/DropDownList";
import {CheckBoxField} from "../../common/components/checkbox/CheckBoxField";

interface Params {
  catId?: string;
}

interface State {
  doValidate?: boolean,
  hasChanges?: boolean,
  message?: string,
  category?: Category
  lstCat?: ComboBoxItem[],
  treeNodes?: NodeData[],
  currentNodeText?: string,

}

interface Props {
  match: match<any>
}

export class EditCategory extends React.Component<Props, State> {
  /**
   * Category Service
   */
  private categoryService: CategoryService = new CategoryService();

  /**
   * State
   * @type {{}}
   */
  state: State = {
    category: {},
    lstCat: [],
    treeNodes: [],
    currentNodeText: ""
  };

  redirect = false

  /**
   * Get category by id
   * @param id
   */
  private async getCatById(id: string) {
    let response = await this.categoryService.getCategoryById(id);
    return response.data;
  }

  /**
   * Load tree data
   */
  async getChildData(id: string): Promise<NodeData[]> {
    let response = await this.categoryService.getChildren(id);
    let data = response.data ? response.data : [];
    let nodes = [];
    data.map((node) => {
      nodes.push({
        id: node.id,
        text: node.name,
        children: [],
        description: node.description
      });
    });
    /**
     *  remove current item
     */
    nodes.map((n, index) => {
      if (n.id == this.state.category.id) {
        nodes.splice(index, 1);
      }
    });
    return nodes;
  }


  /**
   * Save category
   */
  private async saveCategory() {
    this.setState({doValidate: true});
    if (!this.validData()) {
      return;
    }
    Spinner.show(true);
    let response = await this.categoryService.saveCategory(this.state.category);
    if (response.code != categoryResponseCode.Successful) {
      Spinner.show(false);
      await Dialog.show("Information message", response.message);
      return;
    }
    let newCat = response.data || {};
    this.setState({
      category: newCat,
      hasChanges: false
    }, async () => {
      Spinner.show(false);
      let message = "The \"" + newCat.name + "\" category has been saved successfully.";
      await Dialog.show("Information message", message);
      Helper.navigateTo("/category");
    });
    this.loadCategoriesForTree();
  }

  async loadCat() {
    let params = this.props.match.params;
    if (params && !Helper.isNullOrEmpty(params.catId) && params.catId != "0") {
      let response = await this.categoryService.getCategoryById(params.catId);
      let cat = response.data;
      this.setState({category: cat, currentNodeText: "", hasChanges: false});
      if (!Helper.isNullOrEmpty(cat.parentId)) {
        let response = await this.categoryService.getCategoryById(cat.parentId);
        let parent = response.data;
        this.setState({currentNodeText: parent.name})
      }
    }
  }

  /**
   * Component did mount
   */
  componentDidMount() {
    let title = Helper.isNullOrEmpty(this.props.match.params.catId) ? "Create Category" : "Edit Category";
    Helper.setPageTitle(title);
    this.loadCat();
    this.loadCategoriesForTree();
  }

  /**
   * cancel
   */
  async cancel() {
    if (this.state.hasChanges) {
      let message = "Are you want to cancel? By clicking yes, The changes will be canceled";
      let okay = await Dialog.show("Confirm message", message, DialogType.YesNo);
      if (okay) {
        this.redirect = true
        this.setState({})
      }
    } else {
      this.redirect = true
      this.setState({})
    }
  }

  /**
   * Load cat
   */
  async loadCategoriesForTree() {
    try {
      Spinner.show(true);
      this.setState({treeNodes: []});
      let nodes = await this.getChildData("");
      this.setState({
        treeNodes: nodes
      });
      Spinner.show(false);
    } catch (error) {
      Spinner.show(false);
      Dialog.show("Information message", "Couldn't load categories.");
    }
  }

  /**
   * Render menu
   */
  renderMenu() {
    return (
      <Menu>
        <Menu.Menu position={'right'}>
          <Menu.Item>
            <button className="ui icon button blue" onClick={() => {
              this.saveCategory()
            }}><i className="save icon"/>Save
            </button>
          </Menu.Item>
          <Menu.Item>
            <button className="ui icon button basic "
                    onClick={() => {
                      this.cancel();
                    }}>Cancel
            </button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }

  /**
   * valid data
   */
  validData(): boolean {
    let cat = this.state.category;
    if (Helper.isNullOrEmpty(cat.name) || !this.validSlug(cat.slug) || (cat.minZoom && cat.maxZoom && cat.minZoom > cat.maxZoom)) {
      return false;
    }

    return true;
  }

  /* valid slug*/
  validSlug(value) {
    let regex = /^[a-zA-Z_0-9-]*$/;
    let nonSpaceRegex = /^\S*$/;
    return value && regex.test(value) && nonSpaceRegex.test(value);
  }

  selectRootNode() {
    $('#category-tree .active').removeClass('active');
    this.state.category.parentId = null;
    this.setState({currentNodeText: "", hasChanges: true});
  }

  /**
   * Render view
   */
  render() {
    let arrZoomLevel = [];
    for (let i = 13; i <= 19; i++)
      arrZoomLevel.push({text: i, value: i});

    let cat = this.state.category;
    let state = this.state;
    return (
      <div className="category-management">
        {this.redirect ? <Redirect to="/category"/> : ""}
        <div className="ui blurring content-box">
          {
            this.renderMenu()
          }
          <div className="ui grid form">
            <div className=" five wide column">
              <div className="ui form">
                <div className="field">
                  <label>Select Parent</label>
                  <div className="ui icon input">
                    <input
                      type="text"
                      readOnly={true}
                      onChange={(e) => {
                        this.setState({currentNodeText: ""});
                      }}
                      value={state.currentNodeText}
                      placeholder="Root"/>
                    <i className=" search erase link icon" title="Clear parent"
                       onClick={() => {
                         this.selectRootNode()
                       }}/>
                  </div>
                </div>
                <TreeView
                  dataSource={state.treeNodes}
                  treeViewId="category-tree"
                  onTreeNodeClick={(d) => {
                    this.setState({currentNodeText: d.text, hasChanges: true});
                    cat.parentId = d.id;
                  }}
                  loadChildData={async (node): Promise<NodeData[]> => {
                    let a = await this.getChildData(node.id);
                    return a;
                  }}/>
              </div>
            </div>
            <div className="eleven wide column">
              <div className="ui">
                <TextField
                  caption="Name"
                  value={cat.name}
                  isRequired={true}
                  maxLength={40}
                  name={"Name"}
                  doValidation={this.state.doValidate}
                  onChange={(value) => {
                    cat.name = value;
                    state.hasChanges = true;
                  }}/>
                <TextArea
                  caption="Description"
                  value={cat.description}
                  onChange={(value) => {
                    cat.description = value;
                    state.hasChanges = true;
                  }}/>
                <TextField
                  caption="Slug"
                  value={cat.slug}
                  type={"text"}
                  isRequired={true}
                  readOnly={cat && !Helper.isNullOrEmpty(cat.id)}
                  name={"Slug"}
                  doValidation={state.doValidate}
                  errorMessage={"Slug is invalid."}
                  validateFunc={(value) => {
                    return this.validSlug(value);
                  }}
                  onChange={(value) => {
                    cat.slug = value;
                    state.hasChanges = true;
                  }}/>
                <DropDownList
                  label="Min Zoom"
                  data={arrZoomLevel}
                  defaultValue={cat.minZoom}
                  onChange={(value) => {
                    cat.minZoom = +value;
                    this.setState({})
                  }}/>

                <DropDownList
                  label="Max Zoom"
                  data={arrZoomLevel}
                  defaultValue={cat.maxZoom}
                  onChange={(value) => {
                    cat.maxZoom = +value;
                    this.setState({})
                  }}/>
                {
                  state.doValidate && cat.maxZoom && cat.maxZoom && cat.maxZoom < cat.minZoom ?
                    <div className="field">
                      <div className="ui basic red pointing prompt label transition visible">
                        "Max zoom must be greater than or equal min zoom"
                      </div>
                    </div> : null
                }

                <CheckBoxField name="Set On"
                               value={cat.isOn}
                               onClick={e => cat.isOn = e}/>
                <div className="field">
                  <label>Color</label>{
                  <ColorsPicker initColor={this.state.category.color}
                                onChange={(value) => {
                                  this.state.category.color = value;
                                  this.setState({})
                                }}/>}
                </div>
                <div className="field">
                  <label>Icon</label>
                  <IconImage
                    isBase64={true}
                    limit={12}
                    src={this.state.category.icon}
                    onChange={(base64) => {
                      this.state.category.icon = base64;
                    }}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}