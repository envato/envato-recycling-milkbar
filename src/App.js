import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import CardGrid from './components/CardGrid'
import logo from './logo.svg'
import "./App.css";

console.log(logo);

const currentMonth = moment().format("MMMM");
const previousMonth = moment().subtract(1, "months").format("MMMM");

class App extends Component {

  state = {
    currentRecyclingData: [],
    previousRecyclingData: [],
    isLoading: true
  }

  componentDidMount = async () => {
    const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets`;
    const API = await axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json"
      }
    });

    const { data: { values: currentRecyclingData }} = await API.get(
      `/1sNk9S1m2_kJmdj6FwesztvvdrzKFRRkBn7JFQGNY8TQ/values/recycling:${currentMonth.toLowerCase()}!A5:D26?key=AIzaSyDvK1O8LuQKbBH8UBePNCib-vtNmiIbqs0`
    );
    const { data: { values: previousRecyclingData } } = await API.get(`/1sNk9S1m2_kJmdj6FwesztvvdrzKFRRkBn7JFQGNY8TQ/values/recycling:${previousMonth.toLowerCase()}!B5:C25?key=AIzaSyDvK1O8LuQKbBH8UBePNCib-vtNmiIbqs0`);

    this.setState({
      currentRecyclingData,
      previousRecyclingData,
      isLoading: false
    });
    
  };

  render() {

    const { currentRecyclingData, isLoading, previousRecyclingData } = this.state;

    const today = moment(new Date()).format("DD/MM");
    
    const currentDayData = currentRecyclingData.filter(v => {
      let [date] = v;

      return date === today;
    });

    const todayIndex = currentRecyclingData.findIndex( v => {
      return v === currentDayData[0];
    })

    const [previousDayData] = currentRecyclingData.slice(todayIndex - 1, todayIndex)

    return (
      <div className="App">
        <CardGrid
          currentRecyclingData={currentRecyclingData}
          previousRecyclingData={previousRecyclingData}
          currentDayData={currentDayData} 
          previousDayData={previousDayData}
          isLoading={isLoading}  
        />
        <img className="logo" src={logo} width="200" alt=""/>
      </div>
    );
  }
}

export default App;
