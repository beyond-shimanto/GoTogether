import React, { useState } from 'react'
import './css/RouteSelector.css'

const areas = [
  "none",
  "Motijheel",
  "Gulshan",
  "Banani",
  "Uttara",
  "Mirpur",
  "Dhanmondi",
  "Shahbagh",
  "Farmgate",
  "Mohammadpur",
  "Old Dhaka"
];

export const RouteSelector = (props) => {

  const [start, setStart] = useState('none')
  const [end, setEnd] = useState('none')
  const [stops, setStops] = useState([])
  const [currentSelectedStop, setCurrentSelectedStop] = useState('none')

  function handleAddToStop(stop){
    if (stop == 'none'){
      return
    }
    if (stops.includes(stop)){
      return
    }

    setStops(prevValue => {
      return [...prevValue, stop]
    } )
  }

  function handleSubmit(){
    let res = ''
    if((start =='none') || (end =='none')){
      props.handleRouteSubmit(res)
      return
    }
    res = `${start} -> `
    for(let s of stops){
      res = res + `${s} -> `
    }
    res = res + `${end}`

    props.handleRouteSubmit(res)

  }

  return (
    <div className='route-selector'>
      <h4>ROUTE:</h4>
        <h5>start: </h5>
        <select onChange={e => setStart(e.target.value)}>
          {areas.map(a => {
            return <option key={a} value={a}>{a}</option>
          })}
        </select>



        <h5>End:</h5>
        <select onChange={e => setEnd(e.target.value)}>
          {areas.map(a => {
            return <option key={a} value={a}>{a}</option>
          })}
        </select>

        <h5>Stops: </h5>
        {stops.map(s => {
          return <p key={s}>{s}</p>
        })}
        <select onChange={e => setCurrentSelectedStop(e.target.value)}>
          {areas.map(a => {
            return <option key={a} value={a}>{a}</option>
          })}
        </select>
        <button onClick={e => handleAddToStop(currentSelectedStop)}>Add</button>

        <br></br>
        <button onClick={handleSubmit}>Submit</button>

    </div>
  )
}
