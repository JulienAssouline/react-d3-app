var React = require("react")
var d3 = require("d3")

let grouped_values;

class BarStates extends React.Component {
  anchorRef = React.createRef()

  render() {

    const margin = {
      right: 40,
      left: 40,
      top: 40,
      bottom: 40
    }

    const width = this.props.w - margin.right - margin.left;
    const height = this.props.h - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
        .range([0, width])

    const yScale = d3.scaleBand()
      .range([height, 0])


     yScale.domain(this.props.data.map(d => d.State ))


     if (this.props.killedState === true) {
        grouped_values = d3.nest()
           .key(d => d.State)
           .rollup(v => d3.sum(v, d => d.Killed))
           .entries(this.props.data)

        xScale.domain([0, d3.max(this.props.data, d => d.Killed)])
     }
     else {
      grouped_values = d3.nest()
         .key(d => d.State)
         .rollup(v => d3.sum(v, d => d.Injured))
         .entries(this.props.data)

      xScale.domain([0, d3.max(this.props.data, d => d.Injured)])
     }

    var grouped_values_sorted = grouped_values.sort((a, b) => a.value - b.value);


    const yAxis = d3.axisLeft()
      .scale(yScale)
      .tickSizeOuter(0)

     d3.select(this.anchorRef.current)
      .attr("class", "axis_y_states")
      .attr("transform", "translate(100," + margin.top +")")
      .call(yAxis)

     const rectStates = grouped_values_sorted.map((d,i) =>
        <rect
        key = {"rectStates" + i}
        x = {0}
        y = { yScale(d.key) }
        height = { yScale.bandwidth() -1 }
        width = { xScale(d.value) }
        style = {{fill: this.props.killedState === true ? "darkred" : "darkorange",}}
     />)

    return (
      <svg width = {this.props.w} height = {this.props.h} >
      <g ref = {this.anchorRef} transform={"translate(" + margin.left + "," + 40 + ")"}>
        { rectStates }
      </g>
      </svg>

     )

  }
}

export default BarStates