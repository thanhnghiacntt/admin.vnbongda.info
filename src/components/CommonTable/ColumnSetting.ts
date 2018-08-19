export class ColumnSetting {
    name: string
    displayName?: any
    filterable?: boolean
    width?: number
    type?: string = "text"
    selects?: Array<any>
    visible?: boolean

    constructor(name: string, displayName?: string, filterable?: boolean, visible?: boolean, width?: number, type?: string, selects?: any) {
        this.name = name
        this.displayName = displayName ? displayName : name
        this.filterable = filterable
        this.width = width
        this.type = type ? type : "text"
        this.selects = selects
        this.visible = visible ? true : false
    }
}