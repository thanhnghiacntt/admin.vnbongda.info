import * as React from "react";
import TreeNode from "./TreeNode";
import {iter} from "./TreeNode";

interface Props {

  dataSource: Array<any>,
  onTreeNodeClick?: Function,
  loadChildData?: Function,
  treeViewId?: string
}

export default class TreeView extends React.Component<Props,{}> {

  render() {
    var className = '';
    var that = this;
    let treeId = this.props.treeViewId;
    return (

      <div className="treeview" id={this.props.treeViewId? this.props.treeViewId: ""}>
        {
          this.props ?
            this.props.dataSource.map((data, i)=> {
              return (
                <TreeNode key={data.id} data={data}
                          treeViewId={treeId}
                          loadChildData={that.props.loadChildData}
                          onTreeNodeClick={that.props.onTreeNodeClick}>
                  {data.children.map(function (node, i) {
                    return iter(node, that.props.onTreeNodeClick, that.props.loadChildData, treeId);
                  })}
                </TreeNode>
              );
            }) : ""}
      </div>
    );
  }
}

