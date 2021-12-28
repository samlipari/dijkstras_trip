import React, { useState } from 'react';
import './App.css';
import data from './data'
import Table from './components/Table'
import Select from './components/Select'
import Map from './components/Map'



const App = () => {
  const [airline, setAirline] = useState('all')
  const [airport, setAirport] = useState('all')
  const [page, setPage] = useState(1)
  const [endPage, setEndPage] = useState(25)

  const columns = [
    {name: 'Airline', property: 'airline'},
    {name: 'Source Airport', property: 'src'},
    {name: 'Destination Airport', property: 'dest'},
  ];
  
  const formatValue = (property, value) => {
    if (property === "airline") {
      return data.getAirlineById(value)
    } else {
      return data.getAirportByCode(value)
    }
  };
  
  const filteredRoutes = data.routes.filter((route) => {
    let airlineCode;
    let airportCode;

    if (airline !== 'all') {
      airlineCode = data.getAirlineIdByAirlineName(airline)
    }

    if (airport !== 'all') {
      airportCode = data.getAirportCodeByName(airport)
    }

    return (
      (route["airline"] === airlineCode || airline === 'all') && (route["src"] === airportCode || route["dest"] === airportCode || airport === "all")
    )
  })

  const airlineDropdown = data.airlines.map(airline => {
    return (
      <option key={airline.name}>{airline.name}</option>
    )
  })

  const airportDropdown = data.airports.map(airport => {
    return (
      <option key={airport.code}>{airport.name}</option>
    )
  })

  const determineLengthOfPageEnd = () => {
    let pageEnd = page + 24;
    if (pageEnd > filteredRoutes.length) {
      pageEnd = filteredRoutes.length
    }
    if (filteredRoutes.length === 0) {
      pageEnd = 0;
    }

    return pageEnd
  }


  const selectAirlineHandler = (e) => {
    e.preventDefault();
    setPage(1)
    setEndPage(25)
    let airlineValue = e.target.value

    if (airlineValue === 'All Airlines') {
      setAirline('all')
      let airportDropdown = e.target.parentElement.nextElementSibling.firstElementChild.children
      for (let index = 0; index < airportDropdown.length; index++) {
        airportDropdown[index].removeAttribute("disabled")
      }
    } else {
      setAirline(airlineValue)

      let airlineCode = data.getAirlineIdByAirlineName(airlineValue)
      let airportOptions = e.target.parentElement.nextElementSibling.firstElementChild.children
      for (let index = 1; index < airportOptions.length; index++) {
        let airport = airportOptions[index].value
        let airportCode = data.getAirportCodeByName(airport)
        let routes = data.routes.filter(route => route["airline"] === airlineCode && (route["src"] === airportCode || route["dest"] === airportCode))
        if (routes.length === 0) {
          airportOptions[index].setAttribute('disabled', true)
        } else {
          airportOptions[index].removeAttribute('disabled')
        }

      }
    }
  }

  const selectAirportHandler = (e) => {
    e.preventDefault();
    let airport = e.target.value
    setPage(1)
    setEndPage(25)

    if (airport === 'All Airports') {
      setAirport('all')
      let airlineDropdown = e.target.parentElement.previousElementSibling.firstElementChild.children
      for (let index = 0; index < airlineDropdown.length; index++) {
        airlineDropdown[index].removeAttribute("disabled")
      }
    } else {
      setAirport(airport)

      let airportCode = data.getAirportCodeByName(airport)
      let airlineOptions = e.target.parentElement.previousElementSibling.firstElementChild.children
      for (let index = 1; index < airlineOptions.length; index++) {
        let airline = airlineOptions[index].value
        let airlineCode = data.getAirlineIdByAirlineName(airline)
        let routes = data.routes.filter(route => route["airline"] === airlineCode && (route["src"] === airportCode || route["dest"] === airportCode))
        if (routes.length === 0) {
          airlineOptions[index].setAttribute('disabled', true)
        } else {
          airlineOptions[index].removeAttribute('disabled')
        }
      }
    }

  }

  const previousPage = (e) => {
    e.preventDefault();
    setPage(page - 25)
    if (endPage === filteredRoutes.length) {
      setEndPage((page - 25) + 25)
    } else {
      setEndPage(endPage - 25)
    }
  }

  const nextPage = (e) => {
    e.preventDefault();
    setPage(page + 25)

    if (endPage + 25 >= filteredRoutes.length) {
      setEndPage(filteredRoutes.length)
    } else {
      setEndPage(endPage + 25)
    }

    if (endPage >= filteredRoutes.length) {
      e.target.setAttribute('disabled', true)
    }
  }

  const clearFilters = (event) => {
    setAirline('all')
    setAirport('all')
    let airportSibling = event.target.previousElementSibling.firstElementChild;
    airportSibling.value = 'All Airports'
    let airlineSibling = event.target.previousElementSibling.previousElementSibling.firstElementChild
    airlineSibling.value = 'All Airlines'
    let airportDropdown = airportSibling.children
    let airlineDropdown = airlineSibling.children
    for (let index = 0; index < airportDropdown.length; index++) {
      airportDropdown[index].removeAttribute('disabled')
    }
    for (let index = 0; index < airlineDropdown.length; index++) {
      airlineDropdown[index].removeAttribute('disabled')
    }

  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Airline Routes</h1>
      </header>
    <section>
      <Map routes={filteredRoutes} airports={data.airports}/>
    </section>
    <section className="filters">
      Show routes on <Select options={airlineDropdown} valueKey="id" titleKey="name" allTitle="All Airlines" value="" onSelect={selectAirlineHandler} /> flying in or out of <Select options={airportDropdown} allTitle="All Airports" onSelect={selectAirportHandler}/> <button onClick={clearFilters}>Show All Routes</button>
    </section>
    <section>
      <Table columns={columns} format={formatValue} rows={filteredRoutes} page={page} endPage={endPage}/>
    </section>
    <section>
      <p>Showing {page} - {determineLengthOfPageEnd()} of {filteredRoutes.length} routes</p>
      <button id="prev" disabled={page === 1} onClick={previousPage}>Previous Page</button><button disabled={determineLengthOfPageEnd() >= filteredRoutes.length} onClick={nextPage}>Next Page</button>
    </section>
  </div>
  )
}

export default App;