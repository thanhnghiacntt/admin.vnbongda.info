/**
 * Created by huy on 10/19/2016.
 */
import * as React from 'react';

import {Grid, Column} from '../common/components/grid'
import {Prototype} from "../models/Prototype";
import {Link} from "react-router-dom";
import {SearchBox} from "../common/components/searchbox/SearchBox";
import {Message} from "../common/components/message/Message";
import {PrototypeService} from "../services/PrototypeService";
import {CategoryService} from "../services/CategoryService";
import {Helper} from "../utils/Helper";
import {ResponseCode} from "../common/network/ResponseCode";
import {Spinner} from "../common/components/loader/Spinner";
import {Dialog, DialogType} from "../common/components/dialog/Dialog";

/**
 * state of the BuildingPrototypePage
 */
interface State {

  /**
   * list of building prototypes
   */
  prototypes?: Prototype[];

  /**
   * total of building prototypes
   */
  totalBuildingPrototypes?: number;


  /**
   * the current page
   */
  currentPage?: number;

  /**
   * search query
   */
  query?: string;


  /**
   * the error message
   */
  errorMessage?: string;

  /**
   * current building prototype name
   */
  buildingPrototypeName?: string
}

interface Props {
  location?: any;
}

/**
 * the building prototype page
 */
export default class PrototypePage extends React.Component<Props, State> {

  /**
   * initial state
   */
  state: State = {
    prototypes: [],
    totalBuildingPrototypes: 0,
    currentPage: 0,
    query: ""
  };

  /**
   * the building prototype service
   */
  private prototypeService = new PrototypeService();
  private categoryServices = new CategoryService();

  /**
   *  Load category
   */
  async loadCategories() {
    let content = (await this.categoryServices.getCategories()).data;
    if (content && content.data) {
      return content.data;
    }
    return [];
  }

  /**
   * load module from server
   */
  async loadPrototype(page: number = 0,
                      itemsPerPage: number = 10) {
    Spinner.show(true);
    this.setState({
      currentPage: page,
      errorMessage: null,
    });

    try {
      const query = this.prototypeService.query()
        .skip(page * itemsPerPage)
        .take(itemsPerPage);

      if (this.state.query !== "") {
        query.where("name").contains(this.state.query);
      }
      const response = await this.prototypeService.executeQuery(query);
      let cats = await this.loadCategories();
      let result = response.data;
      if (result && result.data) {
        result.data.map(item => {
          let catString = [];
          cats.map(c => {
            if (item.categories && item.categories.indexOf(c.slug) != -1) {
              catString.push('<div class="category-item">' + c.name + '</div>');
            }
          });
          item.categories = catString.join(" ");
        });
      }
      this.setState({
        prototypes: result.data || [],
        totalBuildingPrototypes: result.count || 0,
      });
      Spinner.show(false);
    } catch (error) {
      Spinner.show(false);
      let message = "Couldn't load prototypes."
      Dialog.show("Information message", message);
    }
  }

  /**
   * did mount event
   */
  componentDidMount() {
    Helper.setPageTitle("Manage Prototypes");
    let page = this.props.location.currentPage || 0;
    this.state.query = this.props.location.query || "";
    this.loadPrototype(page, 10);
  }

  // componentWillMount(){
  //   this.state.currentPage = document["prototypesPage"] || 0;
  //   debugger;
  //   this.setState({});
  // }

  /**
   * handle query did change
   * @param value value of the query
   */
  private setQuery(value: string) {
    this.setState({query: value});
  }

  /**
   * Start process to delete the building prototype
   * @param prototype the building prototype to delete
   */
  private async deletePrototype(prototype: Prototype) {
    try {
      const isOK = await Dialog.show("Confirm message", "Are you sure you want to delete this prototype?", DialogType.YesNo);
      if (isOK) {
        Spinner.show(true);
        this.setState({
          errorMessage: null,
          buildingPrototypeName: prototype.name
        });
        let response = await this.prototypeService.delete(prototype);
        if (response.code == ResponseCode.prototypeIsUsedByCommon || response.code == ResponseCode.prototypeIsUsedBySObject) {
          response = await this.forceDeletePrototype(prototype.id);
          Spinner.show(false);
          return;
        }else{
          if (response.code == ResponseCode.success) {
            if(this.state.currentPage > 0 && this.state.prototypes != null && this.state.prototypes.length == 1){
              this.state.currentPage--;
            }
          }
        }
        await Dialog.show("Information message", response.message);
        await this.loadPrototype(this.state.currentPage);
      }
    } catch (error) {
      Spinner.show(false);
      let message = "Couldn't complete operation.";
      Dialog.show("Information message", message);
    }
  }

  /**
   * Force delete building prototype.
   * @param id
   */
  private async forceDeletePrototype(id) {
    try {
      const isOK = await  Dialog.show("Confirm message", "Prototype \"" + this.state.buildingPrototypeName + "\" is used by other common object. Do you want to force delete this prototype?", DialogType.YesNo);
      if (isOK) {
        Spinner.show(true);
        this.setState({
          errorMessage: null
        });
        let response = await this.prototypeService.forceDelete(id);
        if (response.code == ResponseCode.success) {
          if(this.state.currentPage > 0 && this.state.prototypes != null && this.state.prototypes.length == 1){
            this.state.currentPage--;
          }
          await this.loadPrototype(this.state.currentPage);
        }
        Spinner.show(false);
        await Dialog.show("Information message", response.message)
      }
    } catch (error) {
      Spinner.show(false);
      await Dialog.show("Information message", "Couldn't complete operation.")
    }
  }

  private getTo(path){
    return {
      pathname: path,
      currentPage: this.state.currentPage,
      query: this.state.query,
      rowNumber: this.state.prototypes.length
    }
  }

  /**
   * render the page
   * @return {any}
   */
  render() {
    return (
      <div id="building-prototypes">
        <div className="ui blurring content-box">
          <div className="ui secondary menu">
            <div className="right menu">
              <div className="item" style={{display: "none"}}>
                <div className="ui icon button">
                  <i className="filter icon"/>
                </div>
              </div>
              <div className="item">
                <SearchBox value={this.state.query}
                           onEnter={() => {
                             this.loadPrototype()
                           }}
                           onChange={query => this.setQuery(query)}/>
              </div>
              <div className="item">
                <Link to={this.getTo("/prototype/add")}
                      className="ui btn-create icon button">
                  <i className="add icon"/>
                  Create New
                </Link>
              </div>
            </div>
          </div>
          <div className="clear"/>
          <Message message={this.state.errorMessage} className="negative"/>
          <Grid data={this.state.prototypes}
                onPageChanged={
                  (currentPage, itemsPerPage) => {
                    document["PrototypesPage"] = currentPage;
                    this.loadPrototype(currentPage, itemsPerPage)
                  }
                }
                currentPage={this.state.currentPage}
                itemsPerPage={10}
                totalItems={this.state.totalBuildingPrototypes}>
            <Column name="no"
                    renderer={(config, name, index) => {
                      return (<span>
                    {index + 1 + this.state.currentPage * 10} </span>)
                    }}
                    width={'5%'}
                    textAlign={'center'}
                    displayName="No."/>
            <Column name="name"
                    width={'30%'}
                    displayName="Name"/>
            <Column name="thumbnail" displayName="Thumbnail"
                    width={"15%"}
                    textAlign={"center"}
                    renderer={(prototype: Prototype) => (
                      <img height={80} width={80} src={prototype.thumbnail} alt="No images"/>
                    )}/>
            <Column name="categoryIds" displayName="Categories"
                    width={"28%"}
                    textAlign={"center"}
                    renderer={(prototype: Prototype) => (
                      <div dangerouslySetInnerHTML={{__html: prototype.categories}}/>
                    )}/>
            <Column name="actions"
                    displayName="Actions"
                    width={""}
                    renderer={(prototype: Prototype) => (
                      <div>
                        <Link
                          to={this.getTo("/prototype/edit/" + prototype.id)}
                          className="ui mini icon button">
                          <i className="edit icon"/>
                          Edit
                        </Link>
                        <a
                          onClick={() => this.deletePrototype(prototype)}
                          className="ui mini icon button">
                          <i className="delete icon"/>
                          Delete
                        </a>
                      </div>
                    )}/>
          </Grid>

        </div>
      </div>
    );
  }
}