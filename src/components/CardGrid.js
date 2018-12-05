import React from "react";
import Card from "./Card";
import moment from "moment";


const calculateTotalAverage = (arr) => {
 return arr
    .reduce((acc, v) => {
      acc.push((v[1] / v[0]) * 100);
      return acc;
    }, [])
    .reduce((acc, v) => {
      return acc + v / arr.length;
    }, 0);
}

function CardGrid(props) {

  let date, prevDaynonContaminated, prevDaycontaminated;
  if (props.previousDayData) {
    [date, prevDaynonContaminated, prevDaycontaminated] = props.previousDayData;
  }

  const monthRecyclingData = props.currentRecyclingData
    .filter(v => v.length > 1)
    .reduce(function(acc, v) {
      acc.push([parseFloat(v[1]), parseFloat(v[2])]);
      return acc;
    }, []);

  const currengAvgTotal = calculateTotalAverage(monthRecyclingData);
  const prevAvgTotal = calculateTotalAverage(props.previousRecyclingData);

  const [total, monthContaminated] = monthRecyclingData.reduce(function (r, a) {
    a.forEach(function (b, i) {
      r[i] = (r[i] || 0) + b;
    });
    return r;
  }, []);

  return <div className="grid">
      <Card>
        {!props.isLoading ? <>
            <h1>Recycling</h1>
            <ul className="box__content">
              <li>
                {date && <h3>
                    {" "}
                    {moment(date, "DD/MM").format("ddd, D MMM")}{" "}
                  </h3>}
                <p>
                  {" "}
                  {`${prevDaycontaminated} of ${prevDaynonContaminated} bags contaminated (${Math.round(
                    (prevDaycontaminated / prevDaynonContaminated) * 100
                  )}%)`}{" "}
                </p>
              </li>
              <li>
                <h3>This month so far</h3>
            <p>{`${monthContaminated} of ${total} bags contaminated (${Math.round(
              (monthContaminated / total) * 100
            )}%)`}</p>
              </li>
              <li>
                <h3>Last month</h3>
             <p>{`${Math.round(prevAvgTotal)}%`} contamination rate</p>
              </li>
            </ul>

            <div className="box__results">
              
          <h2>On track to improving? {currengAvgTotal < prevAvgTotal ? <span role="img" aria-label="thumbs up">👍</span> : <span role="img" aria-label="thumbs down">👎</span> }</h2>

            </div>
          </> : "loading..."}
      </Card>
      <div className="box">
        <h1>Milk bar charity</h1>

        <ul className="box__content">
          <li>
            <h3>December Charity</h3>
            <p>Some charity name</p>
          </li>
          <li>
            <h3>About</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque
              hic nulla impedit recusandae repellendus veniam voluptatem
              provident consectetur vitae natus, nihil accusamus possimus
              corporis tenetur? Nostrum veritatis ipsum qui accusantium.
            </p>
          </li>
        </ul>

        <div className="box__results">
          Amount raised so far: <span>$527</span>
        </div>
      </div>
    </div>;
}

export default CardGrid;
