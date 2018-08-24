import * as React from "react";
import { AppStore, AppEvent } from "../redux/AppStore";
import CategoryEntity from "../models/CategoryEntity";
import {CategoryService} from "../services/CategoryService";
import {Label} from "react-bootstrap";
import {Helper} from "../helpers/Helper";
export interface AdminCategoryEditProps {
  category?: CategoryEntity;
  onCancel?: Function;
  onSave?: Function;
  list?: Array<CategoryEntity>;
}

export interface AdminCategoryEditState{
  errorMessage?: string;
  category?: CategoryEntity;
}

export class AdminCategoryEdit extends React.Component<AdminCategoryEditProps, AdminCategoryEditState> {

  categoryService = new CategoryService();

  state: AdminCategoryEditState = {
    errorMessage: null,
    category: this.categoryService.getNewCategoryEntity()
  };

  strings = AppStore.getState().strings;

  componentDidMount() {
    this.state.category = this.props.category;
    this.setState({});
  }

  render() {
    return (
      <div className="form-horizontal">
        <div className="row">
          <div className="col-md-3"><Label>{this.strings.name}</Label></div>
          <div className="col-md-6">
            <div className="form-group has-danger">
              <div className="input-group mb-2 mr-sm-2 mb-sm-0">
                <input type="text" name="email"
                       className="form-control"
                       value={this.state.category.name}
                       onChange={(event) => {this.state.category.name = event.target.value; this.setState({})}}
                       placeholder={this.strings.name} required={true} autoFocus={true}/>
              </div>
            </div>
          </div>
          <div className="col-md-3"/>
        </div>
        <div className="row">
          <div className="col-md-3"><Label>{this.strings.description}</Label></div>
          <div className="col-md-6">
            <div className="form-group has-danger">
              <div className="input-group mb-2 mr-sm-2 mb-sm-0">
                <input type="text" name="email"
                     className="form-control"
                     value={this.state.category.description}
                     onChange={(event) => {this.state.category.description = event.target.value; this.setState({})}}
                     placeholder={this.strings.description} required={true} autoFocus={true}/>
              </div>
            </div>
          </div>
          <div className="col-md-3"/>
        </div>
        <div className="row">
          <div className="col-md-3"><Label>{this.strings.slug}</Label></div>
          <div className="col-md-6">
            <div className="form-group has-danger">
              <div className="input-group mb-2 mr-sm-2 mb-sm-0">
                <input type="text" name="email"
                       className="form-control"
                       value={this.state.category.slug}
                       onChange={(event) => {this.state.category.slug = event.target.value; this.setState({})}}
                       placeholder={this.strings.description} required={true} autoFocus={true}/>
              </div>
            </div>
          </div>
          <div className="col-md-3"/>
        </div>
        <div className="row">
          <div className="col-md-3"><Label>{this.strings.parentid}</Label></div>
          <div className="col-md-6">
            <div className="form-group">
              <select className="form-control" onChange={(value) => {this.onSelect(value)}}>
                <option id="0" key="-1" selected={this.state.category != null && this.state.category.id == 0}>None</option>
              {
                this.props.list != null && this.props.list.length > 0 ?
                this.props.list.map((value, index, array)=>{
                  return <option key={value.id} id={value.id + ""} selected={this.state.category.id == value.id}>{value.name}</option>
                }): null
              }
              </select>

            </div>
          </div>
          <div className="col-md-3"/>
        </div>
        <div className="row">
          <div className="col-md-3"><Label>{this.strings.orderby}</Label></div>
          <div className="col-md-6">
            <div className="form-group has-danger">
              <div className="input-group mb-2 mr-sm-2 mb-sm-0">
                <input type="number" name="email"
                       className="form-control"
                       value={this.state.category.orderBy}
                       onChange={(event) => {this.state.category.orderBy = +event.target.value; this.setState({})}}
                       placeholder="0" autoFocus={true}/>
              </div>
            </div>
          </div>
          <div className="col-md-3"/>
        </div>
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-3">
            <div className="form-group has-danger">
              <div className="input-group mb-2 mr-sm-2 mb-sm-0">
                <button type="button"
                        onClick={()=>this.cancel()}
                        className="btn btn-primary btn-lg btn-block">Calcel</button>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group has-danger">
              <div className="input-group mb-2 mr-sm-2 mb-sm-0">
                <button type="button"
                        onClick={() => this.save()}
                        className="btn btn-dark btn-lg btn-block">Save</button>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-control-feedback">
              {
                this.state.errorMessage != null ?
                  <span className="text-danger align-middle">
                  <i className="fa fa-close"></i> {this.state.errorMessage}
                </span>: null
              }

            </div>
          </div>
        </div>
      </div>);
  }

  /**
   * On select
   * @param value
   */
  onSelect(value:any){
    this.state.category.parentId = + value.target.selectedOptions[0].id;
  }

  /**
   * Save
   */
  save(){
    if(Helper.isEmpty(this.state.category.name)){
      this.setState({errorMessage: this.strings.errornameempty})
    }else if(Helper.isEmpty(this.state.category.slug)){
      this.setState({errorMessage: this.strings.errorslugempty})
    }else{
      this.categoryService.save("create", this.state.category, (value)=>{
        this.props.onSave != null? this.props.onSave(value) : null;
      });
    }
  }

  /**
   * Cancel
   */
  cancel(){
    this.props.onCancel != null ? this.props.onCancel() : null;
  }
}