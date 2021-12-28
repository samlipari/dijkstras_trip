import React from "react";

const Select = ({ options, allTitle, onSelect }) => {
  return (
    <div>
      <select type="dropdown" onChange={onSelect}><option>{allTitle}</option>{options}</select>
    </div>
  )
}

export default Select