import * as React from "react";

interface Props{
  showLoader:boolean
}

export class Loader extends React.Component<Props,{}>{
  render(){
    return(
        <div className={this.props.showLoader?"dkm-mini-loading":"dkm-hide"}>
          <div className="dkm-mini-loader">
          </div>
        </div>
    )
  }
}