// import data from './US_mass_shootings_2017.csv';
import us_states from './us.json'
import * as topojson from 'topojson';
var React = require("react")
var d3 = require("d3")


class MapChart extends React.Component{

  state = {
    us_states: [],
  }

  componentWillMount() {

    d3.csv(us_states)
    .then((json) => {
      this.setState({
        us_states
      })
    })

    // Promise.all([
    //   d3.csv(us_states),
    //   d3.csv(data)
    //   ]).then(([json, data]) => {
    //     this.setState({
    //       us_states,
    //       data
    //     })
    //   })

  }

  render() {

   const margin = {
      right: 40,
      left: 40,
      top: 40,
      bottom: 40
    }

     const width = this.props.w - margin.right - margin.left;
    const height = this.props.h - margin.top - margin.bottom;


  const circleScale = d3.scaleSqrt()
    .range([0,7])

  const projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale(600)

    if (this.props.killedState === true) {
      circleScale.domain(d3.extent(this.props.data, d => d.Killed ))
    }
    else {
      circleScale.domain(d3.extent(this.props.data, d => d.Injured ))
    }


  const path = d3.geoPath()
    .projection(projection)

    const { us_states } = this.state

    if(us_states.objects === undefined) {
      return null
    }

    const states = topojson.feature(us_states, us_states.objects.states).features

    this.props.data.forEach((d) => {
      d.coords = projection([d.Longitude, d.Latitude])
    })


    const states_map = states.map((d,i) => <path
      key = { "path" + i }
      d = { path(d) }
      className = { "state" }
      style = {{ fill: "lightgrey" }}
      // attr = {{ stroke: "grey" }}
      />)

    const circles = this.props.data.map((d,i) => <circle
      key = {"circle" + i}
      r = { this.props.killedState === true ? circleScale(d.Killed) : circleScale(d.Injured) }
      cx = { d.coords[0] }
      cy = { d.coords[1] }
      id = { d.State }
      onMouseEnter = { () => { this.props.onHover(d.Date) } }
      onMouseOut = { () => { this.props.onHover(undefined) }}
      style={{
        fill: this.props.killedState === true ? "darkred" : "darkorange",
        stroke: this.props.hoverElement === d.Date ? "black" : "none",
        strokeWidth: this.props.hoverElement === d.Date ? 2 : 1
    }}

      />)

    return (
      <svg width = {this.props.w} height = {this.props.h} >
      <g transform={"translate(" + margin.left + "," + margin.top + ")"}>
      { states_map }
      { circles }
      </g>
      </svg>

     )

      }
  }


export default MapChart;