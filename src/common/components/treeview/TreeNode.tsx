import * as React from 'react';

export interface NodeData {
  id?: string
  text?: string,
  description?: string,
  icon?: string,
  opened?: boolean,
  disabled?: boolean,
  selected?: boolean,
  children?: NodeData[],
  tag?: any
}
interface Props {
  data?: NodeData,
  onTreeNodeClick?: Function,
  keyName?: string,
  treeViewId?: string,
  loadChildData?: any
}
interface State {
  data?: NodeData,
  children?: any,
  loadedChild?: boolean;
}

export default class TreeNode extends React.Component < Props, State > {

  state: State = {
    data: this.props.data,
    children: this.props.children
  };

  arrowClicked(e) {
    this.renderChild(this.state.data, this.props.onTreeNodeClick, this.props.loadChildData);
    this.state.data.opened = !this.state.data.opened;
    this.setState({
      'data': this.props.data
    });
    //e.stopPropagation();
  }

  render() {
    var className = 'treenode';
    var nodeTextClass = 'node-text';
    if (this.props.data.opened) {
      className += ' node-opened';
    }
    else {
      className += ' node-closed';
    }
    if (this.props.data.selected) {
      nodeTextClass += ' node-selected';
    }

    return (
      <div className={className}
           onClick={(e)=>{
             if(this.props.onTreeNodeClick)
               {
                 this.props.onTreeNodeClick(this.props.data, e);
                    $('#'+ this.props.treeViewId + ' .active').removeClass('active');
                    $(e.target).addClass('active');
               }
              e.stopPropagation();
           }}>
        <i className="arrow triangle down  icon" onClick={(e)=>this.arrowClicked(e)}/>

        <div className={nodeTextClass}
             onClick={(e)=>{  this.arrowClicked(e);
             }}>
          {this.props.data.text}
        </div>
        {
          this.state.children
        }
      </div>
    )
  }

  async renderChild(data: NodeData, onclick: Function, loadChildData: Function) {
    if (this.state.loadedChild) {
      return;
    }
    this.setState({loadedChild: true});
    if (this.props.loadChildData) {
      let childData = await this.props.loadChildData(data);
      let newChild = [];
      childData.map((n)=> {
        newChild.push(iter(n, onclick, loadChildData, this.props.treeViewId));
      });
      this.setState({children: newChild});
    }
    return;
  }
}
export function iter(node, treeNodeClick, loadChildData, treeViewId) {
  return (<TreeNode key={node.id} data={node} treeViewId={treeViewId} loadChildData={loadChildData}
                    onTreeNodeClick={treeNodeClick}>
    { node.children.map(function (val) {
      return iter(val, treeNodeClick, loadChildData, treeViewId);
    })}
  </TreeNode>);
}