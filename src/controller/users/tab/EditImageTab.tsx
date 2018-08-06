/**
 * Created by nghiant on 06/10/2016.
 */
import * as React from 'react';


/**
 * the add user
 */
export default class TabEditImage extends React.Component<{}, {}> {
    props:any;

    /**
     * Render html
     */
    render() {
        return (<div className={this.props.tab_pane_image} id="tab_image">
                    <form className="ui form" action="#" role="form">
                        <div className="field">
                            <div className="fileinput fileinput-new" data-provides="fileinput">
                                <div className="fileinput-new thumbnail image_size"> 
                                    <img src={this.props.image}/> 
                                </div>
                                <div className="fileinput-preview fileinput-exists thumbnail image_size"> </div>
                                <div>
                                    <span className="btn default btn-file">
                                        <span className="fileinput-new"> Select image </span>
                                        <span className="fileinput-exists"> Change </span>
                                        <input type="hidden"/>
                                        <input type="file" className="fileinput-new" value="Select image" name=""/> </span>
                                    <a href="javascript:;" className="btn default fileinput-exists" data-dismiss="fileinput"> Remove </a>
                                </div>
                            </div>
                        </div>
                        <div className="margin-top-10">
                            <a href="javascript:;" className="ui button teal"> Submit </a>
                            <a href="javascript:;" className="ui button"> Cancel </a>
                        </div>
                    </form>
                </div>)};
}