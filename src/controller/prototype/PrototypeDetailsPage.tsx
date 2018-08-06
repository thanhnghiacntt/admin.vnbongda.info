import * as React from "react";
import {Prototype} from "../models/Prototype";
import {TextField} from "../common/components/input/TextField";
import {Message} from "../common/components/message/Message";
import {UploadBuildingPrototype} from "../common/components/upload/UploadBuildingPrototype";
import {PrototypeService} from "../services/PrototypeService";
import {Link} from 'react-router-dom'
import {Category} from "../models/Category";
import {CategoryService} from "../services/CategoryService";
import {Helper} from "../utils/Helper";
import {CategoryInput} from "../common/components/autocomplete/CategoryInput";
import {match} from "react-router";
import {Dialog, DialogType} from "../common/components/dialog/Dialog";
import {Spinner} from "../common/components/loader/Spinner";
import {ResponseCode} from "../common/network/ResponseCode";

/**
 * properties of this page
 */
interface Properties {


  /**
   * parameter from router
   */
  match: match<any>;

  /**
   * Location
   */
  location: any;

}

/**
 * the interface
 */
interface State {

  /**
   * the building prototype to edit
   */
  prototype?: Prototype;

  /**
   * is this component loading
   */
  isAddNew?: boolean;

  /**
   * the error message
   */
  errorMessage?: string;


  doValidation?: boolean;

  isThumbnailValid?: boolean;

  isModelValid?: boolean;

  lstCategory?: Category[];

  selectedCats?: Category[];

  currentPage?: number;

  query?: string,

  rowNumber?: number;

}

/**
 * Page for editing and viewing details of a building prototype
 */
export default class PrototypeDetailsPage extends React.Component<Properties, State> {


  /**
   * default state
   */
  state: State = {
    prototype: null,
    isAddNew: false,
    errorMessage: null,
    doValidation: false,
    isThumbnailValid: true,
    isModelValid: true
  };



  /**
   * the building prototype service
   */
  private prototypeService = new PrototypeService();

  private categoryServices = new CategoryService();

  /**
   * callback when component finish mounting
   */
	async componentDidMount() {
    this.initComponent();
  }

  async initComponent() {
    this.state.currentPage = this.props.location.currentPage || 0;
    this.state.query = this.props.location.query || "";
    this.state.rowNumber = this.props.location.rowNumber || 0;
    if (this.props.match.params && this.props.match.params.prototypeId) {
      this.state.isAddNew = false
      this.setState({});
      await this.loadPrototype(this.props.match.params.prototypeId);
    } else {
      let cats = await this.loadCategories();
      this.setState({
        isAddNew: true,
        prototype: {},
        lstCategory: cats
      });
    }
    Helper.setPageTitle(this.state.isAddNew ? "Add Prototype" : "Edit Prototype");
  }

  /**
   * Get to
   * @returns {{pathname: string; currentPage: number | undefined; query: string | undefined}}
   */
  private getTo(){
    return {
      pathname: "/prototype",
      currentPage: this.state.currentPage,
      query: this.state.query
    }
  }

  /**
   * load building prototype
   */
  private async loadPrototype(prototypeId: string) {

		Spinner.show(true)
		let cats = await this.loadCategories();
		const response = await this.prototypeService.get(prototypeId);
		const result = response.data;
		if (response.code != ResponseCode.success){
		  await Dialog.show("Thông báo", "Không load được prototype")
      return
    }

		// get select cat
		let selectedCats = [];

		cats.map(item=> {
			if (result.categories != null && result.categories.indexOf(item.slug) != -1)
				selectedCats.push(item);
		});

    Spinner.show(false)
		this.setState({
			prototype: result,
			selectedCats: selectedCats || [],
			lstCategory: cats,
			errorMessage: null,
		})
  }

  /**
   *
   */
  async loadCategories() {
    let cats = (await this.categoryServices.getCategories()).data;
    if (cats && cats.data) {
      return cats.data;
    }
    return [];
  }

  /**
   * Start process to save the building prototype
   * @param buildingPrototype the building prototype to save
   */
  private async savePrototype(prototype: Prototype) {
		this.setState({doValidation: true});
		if (prototype.name == null || prototype.name.trim() == "") {
			return;
		}
		if (!this.state.isThumbnailValid || !this.state.isModelValid)
			return;

		Spinner.show(true)

		let res = await this.prototypeService.save(prototype);

		if (res.code == ResponseCode.success) {
			this.navigateTo();
		}
		Spinner.show(false)
		await Dialog.show("Thông báo", res.message)
  }

  /**
   * Nevigate to
   */
  navigateTo(){
    Helper.navigateTo({pathname: '/prototype',
      currentPage: this.state.currentPage,
      query: this.state.query});
  }

  /**
   * Start process to delete the building prototype
   * @param buildingPrototype the building prototype to delete
   */
  private async deletePrototype(prototype: Prototype) {
		const isOK = await Dialog.show("Xác nhận", "Bạn có muốn xóa '" + prototype.name + "' không?", DialogType.YesNo)
		if (isOK) {
			Spinner.show(true)
			let result = await this.prototypeService.delete(prototype);
			if (result.code == ResponseCode.prototypeIsUsedByCommon
				|| result.code == ResponseCode.prototypeIsUsedBySObject
			) {
				Spinner.show(false)
				this.forceDeletePrototype(prototype);
				return
			}
			await Dialog.show("Thông báo", result.message, DialogType.Alert)
			if (result.code == ResponseCode.success){
        if(this.state.currentPage > 0 && this.state.rowNumber == 1){
          this.state.currentPage--;
        }
        this.navigateTo();
			}
		}
  }

  private async forceDeletePrototype(prototype) {
		const isOK = await Dialog.show("Xác nhận",
			"'" + prototype.name + "' đang được sử dụng, bạn có muốn xóa các đối tượng liên quan không?",
			DialogType.YesNo)
		if (isOK) {
			Spinner.show(true)
			let res = await this.prototypeService.forceDelete(prototype.id);
			Spinner.show(false)
			Dialog.show("Thông báo", res.message)
			if (res.code == ResponseCode.success)
			{
        if(this.state.currentPage > 0 && this.state.rowNumber == 1){
          this.state.currentPage--;
        }
        this.navigateTo();
			}
		}
  }

  /**
   * render the edit menu
   */
  renderEditMenu() {
    return (
      <div className="ui secondary menu">
        <div className="right menu">
          <div className="item">
            <a onClick={() => this.savePrototype(this.state.prototype)}
               className="ui blue icon button">
              <span><i className="save icon"/> Save </span>
            </a>
          </div>
          <div className="right menu">
            <div className="item">
              <a onClick={() => this.deletePrototype(this.state.prototype)}
                 className="ui blue button">
                <span><i className="delete icon"/> Delete </span>
              </a>
            </div>
          </div>
          <div className="right menu">
            <div className="item">
              <Link to={this.getTo()} className="ui blue button">
                <span>Cancel</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /**
   * render the add menu
   */
  renderAddMenu() {
    return (
      <div className="ui secondary menu floated right">
        <div className="item">
          <a onClick={() => {
            let p = this.state.prototype;
            this.setState({doValidation: true});
            if (p.name == null || p.name.trim() == "") {
              return;
            }
            if (p.materials == null || p.materials.length == 0) {
              return;
            }
            this.savePrototype(this.state.prototype);
          }}
             className="ui blue button">
            <i className="save icon"/>
            Save
          </a>

        </div>
        <div>
          <Link className="ui blue button" to="/prototype">
            <span>Cancel</span>
          </Link>
        </div>
      </div>
    )
  }

  changeSelectedCategory(categories) {
    let prototype = this.state.prototype;
    prototype.categories = (categories || []).map(x => x.slug);
    this.state.selectedCats = categories;
  }

  /**
   * render this component
   */
  render() {
    return (
      <div className="edit-prototype-buildings" style={{position: "relative"}}>
        <Message message={this.state.errorMessage} className="negative"/>
        {this.state.prototype ? (
          <div className="ui blurring content-box ">
            <div className="ui grid">
              <div className="six wide column">
                <div className="ui form">
                  <TextField
                    caption="Name"
                    doValidation={this.state.doValidation}
                    name={"name"}
                    className={'field'}
                    maxLength={40}
                    isRequired={true}
                    value={this.state.prototype.name ? this.state.prototype.name : ""}
                    onChange={value => {
                         this.state.prototype.name = value;
                       }}/>
                  <div className="field">
                    <CategoryInput key="categoryInputKey" selectedCategories={this.state.selectedCats}
                                   changeCategories={categories => this.changeSelectedCategory(categories)}/>
                  </div>
                </div>
              </div>
              <div className="ten wide column">
                <div className="ui form">
                  <div className="field">
                    <label>Model</label>
                    <UploadBuildingPrototype prototypeDetail={this} doValidation={this.state.doValidation}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="ui divider"/>
            {this.state.isAddNew ? this.renderAddMenu() : this.renderEditMenu()}
          </div>) : null}
      </div>
    )
  }
}