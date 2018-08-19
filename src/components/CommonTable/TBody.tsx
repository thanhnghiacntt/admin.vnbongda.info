import * as React from "react";
import { ColumnSetting } from './ColumnSetting';
import { TRow, Action } from './TRow';
import { Col } from "react-bootstrap";
import * as DateTime from 'react-datetime';
import * as moment from 'moment';

export interface TBodyProps {
    data: Array<any>
    keyField?: string
    columnsSetting?: Array<ColumnSetting>
    handleFieldChange?: Function
    handleSearch?: Function
    handleCellClick?: Function
    onAction?: Function
    hasData?: boolean
}

export class TBody extends React.Component<TBodyProps, {}>{
    handelChange(e: React.ChangeEvent<HTMLInputElement>, name: string) {
        let value = e.target.value
        console.log(`filter on [${name}]: ${e.target.value}`)
        this.props.handleSearch(name, value)
    }

    handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        let value = e.target.value
        let valueConvert = moment(value).valueOf()
        console.log(`filter on [${name}]: ${valueConvert}`)
        this.props.handleSearch(name, value)
    }

    handleChangeDate2 = (name: string, value: any) => {
        let valueConvert = moment(value).valueOf()
        console.log(`filter on [${name}]: ${valueConvert}`)
        this.props.handleSearch(name, value)
    }

    // Click on field [field] of row has key [key]
    handleCellClick(field: any, key: any) {
        this.props.handleCellClick(field, key)
    }

    renderFilterInput = (element: ColumnSetting) => {
        switch (element.type) {
            case "date":
            case "datetime":
                return <DateTime timeFormat={false} onChange={(value) => this.handleChangeDate2(element.name, value)} />
                // return <input
                // onChange={(e) => { this.handleChangeDate(e, element.name) }}
                // type="date"
                // className="form-control" />
            default:
                return <input
                    onChange={(e) => { this.handelChange(e, element.name) }}
                    type={element.type}
                    className="form-control" />
        }
    }

    renderFilter = () => {
        let filterRow: Array<any> = []
        this.props.columnsSetting.forEach(element => {
            if (element.visible) {
                if (element.filterable) {
                    filterRow.push(
                        <td className={"col-" + element.width}
                            key={element.name}>
                            {this.renderFilterInput(element)}
                        </td>
                    )
                }
                else {
                    filterRow.push(<td key={element.name}></td>)
                }
            }
        })
        if (this.props.onAction) {
            filterRow.push(<td key="action"></td>)
        }
        return <tr>{filterRow}</tr>
    }

    renderData = () => {
        let rows: Array<any> = []
        this.props.data.map((element: ColumnSetting, index) => {
            let key = this.props.keyField ? this.props.data[index][this.props.keyField] : index
            rows.push(
                <TRow key={key}
                    rowdata={element}
                    columnsSetting={this.props.columnsSetting}
                    handleFieldChange={(name: string, value: any) => { this.props.handleFieldChange(key, name, value) }}
                    handleCellClick={(field: any) => this.handleCellClick(field, key)}
                    onAction={this.props.onAction ? (type: Action) => this.props.onAction(type, key) : null} />
            )
        })
        return rows
    }

    render() {


        return (
            <tbody>
                {this.renderFilter()}
                {this.props.hasData && this.renderData()}
            </tbody>
        )
    }
}