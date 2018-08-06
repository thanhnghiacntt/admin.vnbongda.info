import {Pie} from 'react-chartjs'
import * as React from 'react'

interface PieChartProps {
  data: CircularChartData[],
  options?: PieChartOptions,
  width?: number,
  height?: number
}

export class PieChart extends React.Component< PieChartProps,{} > {
  render() {
    return (
      <div style={{padding: "10px"}}>
        <Pie data={this.props.data || []} width={this.props.width||150} height={this.props.height||150}/>
        <div className="ui list">
          {
            this.props.data.map(x=> {
              return (
                <div className="item" key={x.color+x.value}>
                  <i className="icon" style={{background: x.color}}/>
                  <div className="content">
                    {
                      x.label
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>);
  }
}