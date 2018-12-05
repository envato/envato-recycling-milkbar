import React from 'react'
import format from 'date-fns/format'

const calculateTotalAverage = arr => {
  return arr
    .reduce((acc, v) => {
      acc.push((v[1] / v[0]) * 100);
      return acc;
    }, [])
    .reduce((acc, v) => {
      return acc + v / arr.length;
    }, 0);
};

function Recycling({ previousDayData, currentRecyclingData, previousRecyclingData }) {

  let date, prevDaynonContaminated, prevDaycontaminated;
  if (previousDayData) {
    [date, prevDaynonContaminated, prevDaycontaminated] = previousDayData;
  }

  const monthRecyclingData = currentRecyclingData
    .filter(v => v.length > 1)
    .reduce(function (acc, v) {
      acc.push([parseFloat(v[1]), parseFloat(v[2])]);
      return acc;
    }, []);

  const currengAvgTotal = calculateTotalAverage(monthRecyclingData);
  const prevAvgTotal = calculateTotalAverage(previousRecyclingData);

  const [total, monthContaminated] = monthRecyclingData.reduce(function (r, a) {
    a.forEach(function (b, i) {
      r[i] = (r[i] || 0) + b;
    });
    return r;
  }, []);

  const dateFormatted = format(date, "ddd, D MMM");

  return (
    <>
      <h1>Recycling</h1>
      <ul className="box__content">
        <li>
          {date && <h3>{dateFormatted}</h3>}
          <p>
            {" "}
            {`${prevDaycontaminated} of ${prevDaynonContaminated} bags contaminated (${Math.round(
              (prevDaycontaminated / prevDaynonContaminated) * 100
            )}%)`}{" "}
          </p>
        </li>
        <li>
          <h3>This month so far</h3>
          <p>{`${monthContaminated} of ${total} bags contaminated (${Math.round((monthContaminated / total) * 100)}%)`}</p>
        </li>
        <li>
          <h3>Last month</h3>
          <p>{`${Math.round(prevAvgTotal)}%`} contamination rate</p>
        </li>
      </ul>

      <div className="box__results">
        <h2>
          On track to improving? {currengAvgTotal < prevAvgTotal ? <span role="img" aria-label="thumbs up">
            👍
                </span> : <span role="img" aria-label="thumbs down">
              👎
                </span>}
        </h2>
      </div>
    </>
  )
}

export default Recycling;