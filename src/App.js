import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import CardGrid from "./components/CardGrid";
import logo from "./logo.svg";
import "./App.css";

const currentMonth = moment().format("MMMM");
const previousMonth = moment()
  .subtract(1, "months")
  .format("MMMM");
const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets`;
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

class App extends Component {
  state = {
    currentRecyclingData: [],
    previousRecyclingData: [],
    charityData: [],
    isLoading: true
  };

  componentDidMount = async () => {
    const {
      data: { values: currentRecyclingData }
    } = await API.get(
      `/${
        process.env.REACT_APP_SHEET_ID
      }/values/recycling:${currentMonth.toLowerCase()}!A5:D?key=${
        process.env.REACT_APP_API_KEY
      }`
    );
    const {
      data: { values: previousRecyclingData }
    } = await API.get(
      `/${
        process.env.REACT_APP_SHEET_ID
      }/values/recycling:${previousMonth.toLowerCase()}!B5:C?key=${
        process.env.REACT_APP_API_KEY
      }`
    );
    const {
      data: { valueRanges: currentMonthCharityData }
    } = await API.get(
      `/${
        process.env.REACT_APP_SHEET_ID
      }/values:batchGet?ranges=milkbar:${currentMonth.toLowerCase()}!B3&ranges=milkbar:${currentMonth.toLowerCase()}!B4&ranges=milkbar:${currentMonth.toLowerCase()}!B7:B&key=${
        process.env.REACT_APP_API_KEY
      }`
    );

    let charityData = [];

    currentMonthCharityData.forEach(function(v) {
      const { values } = v;

      values.length === 1
        ? charityData.push(values[0][0])
        : charityData.push(
            values.reduce((acc, v) => {
              acc.push(v[0]);
              return acc;
            }, [])
          );
    });

    this.setState({
      currentRecyclingData,
      previousRecyclingData,
      charityData: {
        name: charityData[0],
        summary: charityData[1],
        amountRaised: charityData[2]
      },
      isLoading: false
    });
  };

  render() {
    const {
      currentRecyclingData,
      isLoading,
      previousRecyclingData,
      charityData
    } = this.state;

    const today = moment(new Date()).format("DD/MM");

    const currentDayData = currentRecyclingData.filter(v => {
      let [date] = v;

      return date === today;
    });

    const todayIndex = currentRecyclingData.findIndex(v => {
      return v === currentDayData[0];
    });

    const [previousDayData] = currentRecyclingData.slice(
      todayIndex - 1,
      todayIndex
    );
    
    return (
      <div className="App">
        <CardGrid
          currentRecyclingData={currentRecyclingData}
          previousRecyclingData={previousRecyclingData}
          currentDayData={currentDayData}
          previousDayData={previousDayData}
          isLoading={isLoading}
          charityData={charityData}
        />
        <img className="logo" src={logo} width="200" alt="" />
      </div>
    );
  }
}

export default App;