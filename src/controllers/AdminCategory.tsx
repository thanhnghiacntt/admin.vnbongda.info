import * as React from "react";
import { match } from "react-router";
import * as Resource from "../Language"
import { AppStore, AppEvent } from "../redux/AppStore";
import CategoryEntity from "../models/CategoryEntity";
import {CategoryService} from "../services/CategoryService";
import {Const} from "../helpers/Const";
import {HttpResponse} from "../helpers/HttpClient";
import {Helper} from "../helpers/Helper";
export interface HomeProps {
  match: match<any>
}

export interface AdminCategoryState{
  list?: Array<CategoryEntity>;
  errorMessage?: string;
}

export class AdminCategory extends React.Component<HomeProps, AdminCategoryState> {

  state: AdminCategoryState = {
    list: [],
    errorMessage: null
  };
  strings = AppStore.getState().strings;

  categoryService = new CategoryService();

  componentDidMount() {
    AppStore.postEvent(AppEvent.changePageTitle, this.props.match.path);
    this.load();
  }

  render() {
    return (<div>
        <div className="form-horizontal">
          {
            this.state.list.map((value, index)=>{
              return <div className="row" key={index}>
                <div className="col-md-3"><h2>{value.id}</h2></div>
                <div className="col-md-6"/>
                <div className="col-md-3"/>
              </div>
            })
          }
        </div>
    </div>);
  }

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