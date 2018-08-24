import * as React from "react";
import { match } from "react-router";
import * as Resource from "../Language"
import { AppStore, AppEvent } from "../redux/AppStore";
import CategoryEntity from "../models/CategoryEntity";
import {CategoryService} from "../services/CategoryService";
import {Const} from "../helpers/Const";
import {HttpResponse} from "../helpers/HttpClient";
import {Helper} from "../helpers/Helper";
import {AdminCategoryEdit} from "./AdminCategoryEdit";
export interface HomeProps {
  match: match<any>
}

export enum Status{
  ADD = 1,
  EDIT = 2,
  LIST = 3
}

export interface AdminCategoryState{
  list?: Array<CategoryEntity>;
  errorMessage?: string;
  status?: number;
  category?: CategoryEntity
}

export class AdminCategory extends React.Component<HomeProps, AdminCategoryState> {

  categoryService = new CategoryService();

  state: AdminCategoryState = {
    list: [],
    errorMessage: null,
    status: Status.LIST,
    category: this.categoryService.getNewCategoryEntity()
  };
  strings = AppStore.getState().strings;

  componentDidMount() {
    AppStore.postEvent(AppEvent.changePageTitle, this.props.match.path);
    this.load();
  }

  render() {
    return (<div>
      {
        this.state.status == Status.LIST ?
          <div className="form-horizontal">
            <table className="table table-bordered">
              <thead className="thead-light">
              <tr>
                <th>{this.strings.name}</th>
                <th>{this.strings.description}</th>
                <th>{this.strings.slug}</th>
                <th>{this.strings.parentid}</th>
                <th>{this.strings.orderby}</th>
                <th>{this.strings.edit}</th>
                <th>{this.strings.delete}</th>
              </tr>
              </thead>
              <tbody>
              {
                this.state.list.map((value, index)=>{
                  return <tr key={index}>
                    <td>{value.name}</td>
                    <td>{value.description}</td>
                    <td>{value.slug}</td>
                    <td>{value.parentId}</td>
                    <td>{value.orderBy}</td>
                    <td><span className="pointer" onClick={()=>this.edit(value.id)}><i className="fa fa-edit"></i></span></td>
                    <td><span className="pointer" onClick={()=>this.delete(value.id)}><i className="fa fa-remove"></i></span></td>
                  </tr>
                })
              }
              </tbody>
            </table>
            <div className="row">
              <div className="col-md-5"></div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-success" onClick={()=>this.add()}><i className="fa fa-sign-in"></i>{this.strings.add}</button>
              </div>
              <div className="col-md-5"></div>
            </div>
          </div>:
          <AdminCategoryEdit category={this.state.category}
                             list={this.state.list}
                             onCancel={()=>this.onCancel()}
                             onSave={()=>this.onCancel()}/>
      }
    </div>);
  }

  /**
   * Edit
   * @param {number} id
   */
  edit(id: number){
    this.state.list.map((value)=> {
      if(value.id == id){
        this.setState({category: value, status: Status.EDIT});
      }
    })
  }

  /**
   * Add new category
   */
  add(){
    let category = this.categoryService.getNewCategoryEntity();
    this.setState({category: category, status: Status.ADD});
  }

  /**
   * Cancel
   */
  onCancel(){
    this.state.status = Status.LIST;
    this.load();
  }

  /**
   * Delete
   * @param {number} id
   */
  delete(id: number){

  }

  /**
   * Load
   */
  load(){
    this.categoryService.getAll((data: HttpResponse)=>{
      if(data.code == Const.success){
        this.setState({list: Helper.convert(data.data,"CategoryEntity")});
      }else{
        this.setState({errorMessage: data.message});
      }
    });
  }
}