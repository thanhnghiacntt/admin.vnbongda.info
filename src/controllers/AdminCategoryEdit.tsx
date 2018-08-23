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
            <div className="form-group has-danger">
              <div className="input-group mb-2 mr-sm-2 mb-sm-0">
                <input type="number" name="email"
                       className="form-control"
                       value={this.state.category.parentId}
                       onChange={(event) => {this.state.category.parentId = +event.target.value; this.setState({})}}
                       placeholder="0" autoFocus={true}/>
              </div>
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
                        onClick={()=>this.props.onCancel()}
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

  save(){
    if(Helper.isEmpty(this.state.category.name)){
      this.setState({errorMessage: this.strings.errornameempty})
    }else if(Helper.isEmpty(this.state.category.slug)){
      this.setState({errorMessage: this.strings.errorslugempty})
    }else{
      this.categoryService.save("", this.state.category, (value)=>{

      });
    }
  }
}