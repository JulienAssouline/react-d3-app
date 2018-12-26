var React = require("react")
var d3 = require("d3")

class BarChart extends React.Component{


  constructor(props) {
    super(props)
    this.creatBrush = this.creatBrush.bind(this)
    this.createAxis = this.createAxis.bind(this)
  }

  anchorRef = React.createRef()

  componentWillMount() {
    // let node = this.refs.player
    this.createAxis()
    this.creatBrush()
  }

  componentDidUpdate() {
    this.createAxis()
    this.creatBrush()
  }

  creatBrush() {

    let margin = {
      right: 40,
      left: 40,
      top: 40,
      bottom: 40
    }

    let width = this.props.w - margin.right - margin.left;
    let height = this.props.h - margin.top - margin.bottom;

    d3.timeParse("%d-%b-%y")

    const scale = d3.scaleTime().range([0,width])

    scale.domain(d3.extent(this.props.data, d => d.Date))

    const brush = d3.brushX()
      .extent([[0,0], [width, height]])
      .on("brush", brushed)

      if (this.node !== undefined) {

     d3.select(this.node.childNodes[0])
        .selectAll("g.brush")
        .data([0])
        .enter()
        .append("g")
        .attr("class", "brush")

      d3.select(this.node.childNodes[0])
        .select("g.brush")
        .attr("cursor", "ew-resize")
        .call(brush)

      }

    let brushFn = this.props.changeBrush

      function brushed() {
        const selected = d3.event.selection;
        const selectedExtent = selected.map(scale.invert, scale)
        brushFn(selectedExtent)

      }

  }

  createAxis() {
    const margin = {
      right: 40,
      left: 40,
      top: 40,
      bottom: 40
    }

    const width = this.props.w - margin.right - margin.left;
    const height = this.props.h - margin.top - margin.bottom;

    const xScale = d3.scaleTime()
        .range([0, width])

    const yScale = d3.scaleLinear()
      .range([height, 0])

     xScale.domain(d3.extent(this.props.data, d => d.Date ))
    yScale.domain([0, d3.max(this.props.data, d => d.Killed)])

    const xAxis = d3.axisBottom()
      .scale(xScale)
      .ticks(9)
      .tickSizeOuter(0)

     const yAxis = d3.axisLeft()
              .scale(yScale)
              .tickSize(-width,0,0)
              .tickSizeOuter(0)

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];




  if (this.anchorRef.current !== null) {
    d3.select(".axis_y_bars").remove()
    d3.select(".axis_x_bars").remove()

     d3.select(this.anchorRef.current)
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "axis_x_bars")
      .call(xAxis)
      .selectAll("text")
        .text(function(d){
            return months[d.getMonth()] + " '" + (d.getFullYear() - 2000);
        })

    d3.select(this.anchorRef.current)
     .append("g")
     .attr("class", "axis_y_bars")
     .attr("transform", "translate(0,0)")
     .call(yAxis)
     .lower()
  }


  }

  render() {

    let margin = {
      right: 40,
      left: 40,
      top: 40,
      bottom: 40
    }

    let width = this.props.w - margin.right - margin.left;
    let height = this.props.h - margin.top - margin.bottom;

    const xScale = d3.scaleTime()
        .range([0, width])

    const yScale = d3.scaleLinear()
      .range([height, 0])

    xScale.domain(d3.extent(this.props.data, d => d.Date ))

    if (this.props.killedState === true) {
      yScale.domain([0, d3.max(this.props.data, d => d.Killed)])
    }
    else {
      yScale.domain([0, d3.max(this.props.data, d => d.Injured)])
    }

    d3.select(this.refs.bar).raise()

    const rects = this.props.data.map((d, i) =>
      <rect key={"rect"+ i}
        x= { xScale(d.Date) }
        y = { this.props.killedState === true ? yScale(d.Killed) : yScale(d.Injured) }
        width = { 5 }
        height = { this.props.killedState === true ? height - yScale(d.Killed) : height - yScale(d.Injured) }
        style={{fill: this.props.killedState === true ? "darkred" : "darkorange",
          opacity: this.props.extent[0] <= d.Date && this.props.extent[1] >= d.Date ? 1: 0,
          stroke: this.props.hoverElement === d.Date ? "black" : "none",
          strokeWidth: this.props.hoverElement === d.Date ? 2 : 1
        }}
        onMouseOver = { () => { this.props.onHover(d.Date) } }
        onMouseOut = { () => { this.props.onHover(undefined) }}
        className = {"rects-data"}
        ref = {this.props.hoverElement === d.Date ? "player" : "bar" }
        />)

    // return e[0] <= d.date && e[1] >= d.date


    return (
      <svg ref = { node => this.node = node }  width = {this.props.w} height = {this.props.h} >
      <g ref = {this.anchorRef} transform={"translate(" + margin.left + "," + margin.top + ")"}>
      { rects }
     </g>
     </svg>
     )

      }
  }


export default BarChart;