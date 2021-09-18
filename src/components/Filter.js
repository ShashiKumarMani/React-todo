import React from "react";

function Filter(props) {
  return (
    <button type="button" onClick={props.filter}>
        {props.name} 
    </button>
  );
}

export default Filter;