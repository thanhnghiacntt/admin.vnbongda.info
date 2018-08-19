import * as React from "react";
import { match } from "react-router";
import { AppStore } from "../redux/AppStore";
import { FormGroup, ControlLabel, FormControl, Pagination } from "react-bootstrap"

export interface PaggingProps {
    pageSize: number
    pageCount: number
    activePage: number
    maxButtons: number
    onPageSizeChange?: Function
    onSelectPage?: Function
}

export class Pagging extends React.Component<PaggingProps, {}> {
    constructor(props: PaggingProps) {
        super(props)
    }
    strings = AppStore.getState().strings
    handlePageSizeChange = (e: React.FormEvent<FormControl>) => {
        let target = e.target as any
        this.props.onPageSizeChange(target.value)
    }
    handleSelect = (eventKey: any) => {
        console.log(eventKey)
        if (this.props.onSelectPage) {
            this.props.onSelectPage(Number(eventKey))
        }
    }

    private page: HTMLInputElement
    render() {
        return (
            <div className="pagging">
                <Pagination className="" bsSize="small" first last ellipsis boundaryLinks next prev
                    items={this.props.pageCount}
                    maxButtons={this.props.maxButtons}
                    activePage={this.props.activePage}
                    onSelect={this.handleSelect} />
                <FormGroup className="page-size" bsSize="small" controlId="formControlsSelect">
                    <FormControl componentClass="select" placeholder="select" onChange={this.handlePageSizeChange} value={this.props.pageSize}>
                        <option disabled value="select">{this.strings.page_size}</option>
                        <option value="1">1</option>
                        <option value="20">20</option>
                        <option value="40">40</option>
                        <option value="100">100</option>
                    </FormControl>
                </FormGroup>
            </div>
        )
    }

    static createPagging(max_page: number): PaggingProps{
        let pageSize =  AppStore.getState().pageSize
        console.log("pageSize")
        console.log(pageSize)
        let pagging: PaggingProps = {
            pageSize: pageSize,
            pageCount: max_page,
            activePage: 1,
            maxButtons: 3,
        }
        return pagging
    }

    static createPaggingBooking(itemCount: number): PaggingProps{
        let pageSize =  20
        let pagging: PaggingProps = {
            pageSize: pageSize,
            pageCount: Math.floor(itemCount / pageSize) + (itemCount % pageSize ? 1 : 0),
            activePage: 1,
            maxButtons: 3,
        }
        return pagging
    }
}