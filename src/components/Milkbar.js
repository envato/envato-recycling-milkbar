import React from 'react'
import format from 'date-fns/format'

function Milkbar({ charityData}) {

  const monthName = format(new Date(), "MMMM");
  const amountRaised =
    charityData.amountRaised &&
    charityData.amountRaised.reduce(
      (acc, v) => acc + parseFloat(v, 10),
      0
    );

  return <>
      <h1>milk bar charity</h1>
      <ul className="box__content">
        <li>
          <h3>{monthName} Charity</h3>
          <p><strong>{charityData.name}</strong></p>
        </li>
        <li>
          <h3>About</h3>
          <div className="box__summary">
            <p class="justify">{charityData.summary}</p>
          </div>
        </li>
      </ul>
      <div className="box__results">
        <h2>Amount raised so far:</h2>
        <h1>${amountRaised}</h1>

      </div>
    </>;
}

export default Milkbar;
