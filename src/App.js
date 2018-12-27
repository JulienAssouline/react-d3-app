import './App.css';
import BarChart from "./BarChart"
import MapChart from "./MapChart"
import data from './US_mass_shootings.csv';
import BarStates from "./BarStates"
var React = require("react")
var d3 = require("d3")

// var killedData = true;
// var injuredData = false;

class App extends React.Component {

  constructor(props) {
    super(props)
    this.onResize = this.onResize.bind(this)
    this.onHover = this.onHover.bind(this)
    this.onBrush = this.onBrush.bind(this)
    this.killedClick = this.killedClick.bind(this)
    this.injuredClick = this.injuredClick.bind(this)
    this.event = { hover: "none" }
  }

    anchorRef = React.createRef()


  killedClick() {
    this.setState({
      killedData: true,
      injuredData: false
    })
  }

  injuredClick() {
    this.setState({
      killedData: false,
      injuredData: true
    })
  }

   state = {
    data: [],
    screenWidth: window.innerWidth,
    screenHeight: 500,
  }

  onHover(d) {
    this.setState({
      hover: d
    })
  }

  componentWillMount() {
    window.addEventListener("resize", this.onResize, false)

    d3.csv(data)
      .then(data => {
        const date_array = [];
        const parseTime = d3.timeParse("%d-%b-%y")

        data.forEach((d) => {
          d.Date = parseTime(d.Date)
          d.Year = +d.Year
          d.Latitude = +d.Latitude
          d.Longitude = +d.Longitude
          d.Killed = +d.Killed
          d.Injured = +d.Injured

          date_array.push(d.Date)
          })

       var maxDate = new Date(Math.max.apply(null,date_array));
       var minDate = new Date(Math.min.apply(null,date_array));

        // Add Cleaned data to state
        this.setState({
          data,
          brushExtent: [minDate,maxDate],
          killedData: true,
          injuredData: false

        })

      })

  }


  onResize() {
    this.setState({
      screenWidth: window.innerWidth,
      screenHeight: 500
    })
  }

  onBrush(d) {
    this.setState({
      brushExtent: d
    })
  }

  render() {
    const { data } = this.state

    data.sort((a, b) => a.Killed - b.Killed)

    d3.select(".killedButton")
      .style("background-color", () => {
        if (this.state.killedData === true) return "darkred"
        return "lightgrey"
      })
      .style("color", () => {
        if (this.state.killedData === true) return "white"
        return "black"
      })

    d3.select(".injuredButton")
      .style("background-color", () => {
        if (this.state.injuredData === true) return "darkorange"
        return "lightgrey"
      })
      .style("color", () => {
        if (this.state.injuredData === true) return "white"
        return "black"
      })


    // we only use this for the mapChart component. The barChart data changes only on opacity
    const filterData = data.filter((d,i) => this.state.brushExtent[1] >= d.Date && d.Date >= this.state.brushExtent[0] )

    return (
      <div className="App">
      <h2 className = "title"> Mass Shootings in the United States</h2>
      <div id = "button-wrapper">
      <button className = "killedButton" onClick= {this.killedClick}> Killed </button>
      <button className = "injuredButton" onClick= {this.injuredClick}> Injured </button>
      </div>
      <MapChart injuredState = {this.state.injuredData} killedState = {this.state.killedData} hoverElement={this.state.hover} onHover = { this.onHover } w = {this.state.screenWidth } h={this.state.screenHeight} data = { filterData } />
      <BarChart injuredState = {this.state.injuredData} killedState = {this.state.killedData} extent ={this.state.brushExtent} changeBrush = {this.onBrush} hoverElement={this.state.hover} onHover ={ this.onHover } w= {this.state.screenWidth / 2.3 } h={this.state.screenHeight} data = { data } />
      <BarStates injuredState = {this.state.injuredData} killedState = {this.state.killedData} onHover = { this.onHover } w = {this.state.screenWidth / 2.3} h = {this.state.screenHeight} data = {filterData} />
      </div>
    );
  }

}

export default App;
