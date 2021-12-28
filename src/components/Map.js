import React from "react";

const Map = ({ routes, airports }) => {
  let id = 0;

  const coordinates = routes.map(route => {
    let srcAirport = airports.find(airport => airport.code === route.src)
    let srcLat = srcAirport["lat"]
    let srcLong = srcAirport["long"]
    let destAirport = airports.find(airport => airport.code === route.dest)
    let destLat = destAirport["lat"]
    let destLong = destAirport["long"]
    id++
    return (
      <g key={id}>
      <circle className="source" cx={srcLong} cy={srcLat}>
        <title></title>
      </circle> 
      <circle className="destination" cx={destLong} cy={destLat}>
        <title></title>
      </circle>
      <path d={`M${srcLong} ${srcLat} L ${destLong} ${destLat}`} />
    </g>
    )
  })

  return (
    <svg className="map" viewBox="-180 -90 360 180">
      <g transform="scale(1 -1)">
        <image xlinkHref="equirectangular_world.jpg" href="equirectangular_world.jpg" x="-180" y="-90" height="100%" width="100%" transform="scale(1 -1)"/>

        {coordinates}

      </g>
    </svg>
  )
}

export default Map