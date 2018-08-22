import * as React from "react";
import { match } from "react-router";
import * as Resource from "../Language"
import { AppStore, AppEvent } from "../redux/AppStore";
import {Helper} from "../helpers/Helper";
export interface Props {
  match: match<any>
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class Setting extends React.Component<Props, {}> {

  strings = AppStore.getState().strings;

  componentDidMount() {
    AppStore.postEvent(AppEvent.changePageTitle, this.props.match.path);
  }

  render() {
    return (<div>
      <div className="row">
        <div className="col-md-3">
          <h2>{this.strings.setting}</h2>
        </div>
        <div className="col-md-6"/>
        <div className="col-md-3"/>
      </div>
      <div className="row">
        <div className="col-md-2"/>
        <div className="col-md-3">
          <button type="button"
                  onClick={()=> this.onClick("/user/post")}
                  className="btn btn-primary btn-lg btn-block">{this.strings.post}</button>
        </div>
        <div className="col-md-3">
            <button type="button"
                    onClick={()=> this.onClick("/user/category")}
                    className="btn btn-primary btn-lg btn-block">{this.strings.category}</button>
        </div>
        <div className="col-md-3">
          <button type="button"
                  onClick={()=> this.onClick("/user/gallery")}
                  className="btn btn-primary btn-lg btn-block">{this.strings.gallery}</button>
        </div>
        <div className="col-md-2"/>
      </div>
    </div>);
  }

  onClick(url: string){
    Helper.navigateTo(url);
  }
}