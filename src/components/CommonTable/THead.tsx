import * as React from "react";
import { AppStore } from "../../redux/AppStore";
import { Col } from "react-bootstrap";
import { ColumnSetting } from "./ColumnSetting";

export interface THeadProps {
    columnsSetting: Array<ColumnSetting>
    hasAction?: boolean
}

export class THead extends React.Component<THeadProps, {}>{
    strings = AppStore.getState().strings

    render() {
        let tds: Array<any> = []
        this.props.columnsSetting.forEach(element => {
            if (element.visible){
                tds.push(
                    <th className={`col-${element.width}`}
                        key={element.name}>
                        <label>{this.strings[element.displayName]}</label>
                    </th>)
            }
        });
        if(this.props.hasAction){
            tds.push(<th key="action" className="col-1"></th>)
        }
        return (
            <thead>
                <tr>{tds}</tr>
            </thead>
        )
    }
}