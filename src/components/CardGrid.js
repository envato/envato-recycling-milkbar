import React from "react";
import Card from "./Card";
import Recycling from './Recycling'
import Milkbar from './Milkbar'

function CardGrid(props) {
  return !props.isLoading ? <>
      <div className="grid">
        <Card content={<Recycling {...props} />} />
        <Card content={<Milkbar {...props} />} />
      </div>
    </> : <div className="loading">Loading...</div>;
}

export default CardGrid;
