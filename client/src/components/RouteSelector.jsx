import React, { useEffect, useState } from 'react'
import './css/RouteSelector.css'




export const RouteSelector = (props) => {
  const [stopPoints, setStopPoints] = useState([])

  function addNewRoutePoint(newRoute){
    setStopPoints(oldValue => {
      return [...oldValue, newRoute]
    })
  }

  function handleSubmit(){
    const res = stopPoints.join(' -> ')

    props.handleRouteSubmit(res)

  }

  function handleRoutePointDelete(routePoint){
    setStopPoints(stopPoints.filter((sp) => {
      if (sp == routePoint){
        return false
      }
      return true
    }))
  }

  useEffect(() => {
    handleSubmit()
  }, [stopPoints])


  return (
    <div className='route-selector'>

      {stopPoints.map(sp => {
        return <RoutePoint pointName={sp} handleRoutePointDelete={handleRoutePointDelete} ></RoutePoint>
      })}
      <AddRoutePointButton addNewRoutePoint={addNewRoutePoint} ></AddRoutePointButton>
    </div>
  )
}



function RoutePoint(props){

  function handleClick(){
    props.handleRoutePointDelete(props.pointName)
  }

  return(
       <div className='route-point'>
        <div className="circle-holder">
            <div className="circle" onClick={handleClick}>
              <h6>Delete</h6>
            </div>
            <p>{props.pointName}</p>
          </div>
          <div className="line-holder">
            <div className="line"></div>
          <div className='arrow-head'></div>
        </div>
    </div>

  )


}

function AddRoutePointButton(props){

  const areas = [
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

  const [selectClass, setSelectClass] = useState('hide')
  const [addLabelClass, setAddLabelClass] = useState('')
  const [newRoutePoint, setNewRoutePoint] = useState('')

  function handleClick(){

    if(newRoutePoint){
      props.addNewRoutePoint(newRoutePoint)
      setNewRoutePoint('')
    }

    if (selectClass === 'hide'){
      setAddLabelClass('hide')
      setSelectClass('')
    }else{
      setAddLabelClass('')
      setSelectClass('hide')
    }
  }

    return(
       <div className='btn-add-stop-point'>
        <div className="circle-holder">
          <div className="circle" onClick={handleClick}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12H20M12 4V20" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            <p className={addLabelClass}>Add</p>
          </div>
          <select className={selectClass} onChange={e => setNewRoutePoint(e.target.value)}>
          {areas.map(a => {
            return <option key={a} value={a}>{a}</option>
          })}
        </select>
          </div>
    </div>

  )

}
