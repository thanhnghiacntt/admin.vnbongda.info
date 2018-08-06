/**
 * DungDh edit
 */

import * as React from 'react'
import {Bar} from "react-chartjs";

interface BarChartProps {
  data: LinearChartData,
  options?: BarChartOptions,
  width?: number,
  height?: number
}


export class BarChart extends React.Component<BarChartProps,{}> {
  private linearData: LinearChartData = {
    labels: [],
    datasets: [
      {
        fillColor: "rgba(151,187,205,0.2)",
        highlightFill: "",
        strokeColor: "rgba(151,187,205,1)",
        highlightFill: "#fff",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "",
        pointHighlightStroke: "rgba(151,187,205,1)",
        highlightStroke: "",
        label: "",
        backgroundColor: ['red', 'red'],
        data: []
      }
    ]
  };

  render() {
    let barOptions = {
      tooltipFillColor: 'rgb(25, 165, 206)',
      multiTooltipTemplate: "<%= value %>",
      tooltipTemplate: "<%= value %>",
    };
    return (
      <div style={{padding: "10px"}}>
        <Bar
          options = {barOptions}
          data={this.props.data || this.linearData}
          width={this.props.width}
          height={this.props.height || 150}/>
      </div>);
  }
}