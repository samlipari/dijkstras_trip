import React from "react"

const Table = ({ 
  columns = [{ name: "header", property: "value"}],
  rows = [{ id: 1, value: "cell" }],
  format,
  page,
  endPage
 }) => {

  const headerCells = columns.map(col => {
    return <th key={col.name}>{col.name}</th>
  })

  const bodyRows = rows.slice(page - 1, endPage + 1).map((row) => {
    const rows = columns.map((col) => {
      const value = row[col.property];
      return <td key={col.property + value}>{format(col.property, value)}</td>;
    });
    return <tr key={Object.values(row).join(":")}>{rows}</tr>;
  });

  return (
    <div>
    <table className="routes-table">
      <thead>
        <tr>{headerCells}</tr>
      </thead>
      <tbody>{bodyRows}</tbody>
    </table>
    </div>
  )
}

export default Table