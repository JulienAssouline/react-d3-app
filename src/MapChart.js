// import data from './US_mass_shootings_2017.csv';
import us_states from './us.json'
import * as topojson from 'topojson';
var d3 = require("d3")
var React = require("react")


class MapChart extends React.Component{

  state = {
    us_states: [],
  }

  componentWillMount() {

    d3.csv("./us.json")
    .then((json) => {
      console.log(json)
      this.setState({
        us_states
      })
    })
    .catch(error => {
    console.log(error)
    });

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
      onMouseEnter = { () => {
        this.props.onHover(d.Date)
        d3.select(this.node)
        .transition()
        .duration(100)
        .style("opacity", 1)

      const number_victims = this.props.killedState === true ? d.Killed : d.Injured
      const text_victims = this.props.killedState === true ? "killed" : "injured"

        d3.select(this.node)
        .html(number_victims + " " + text_victims + " in " + d.City)

      }}
      onMouseMove = { () => {
        d3.select(this.node)
        .style("left", (window.event.pageX - 40) + "px")
        .style("top", (window.event.pageY - 45) + "px")

      }}
      onMouseOut = { () => {
        this.props.onHover(undefined)

        d3.select(this.node)
        .transition()
        .duration(100)
        .style("opacity", 0)
      }}
      style={{
        fill: this.props.killedState === true ? "darkred" : "darkorange",
        stroke: this.props.hoverElement === d.Date ? "black" : "none",
        strokeWidth: this.props.hoverElement === d.Date ? 2 : 1
    }}


      />)

    return (
      <div className="map">
      <svg width = {this.props.w} height = {this.props.h} >
      <g transform={"translate(" + margin.left + "," + margin.top + ")"}>
      { states_map }
      { circles }
      </g>
      </svg>
      <div ref = { node => this.node = node } className = "tooltip" style = {{ opacity: 0 }}> </div>
      </div>

     )

      }
  }


export default MapChart;