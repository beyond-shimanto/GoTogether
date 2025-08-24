import React from 'react'
import { useState } from 'react'
import './css/TimeSelector.css'

const hours = ['none']
let i = 0
while (i <= 24){
    hours.push(i)
    i = i+1
}
const minutes = ['none']
let k = 0
while (k <= 60){
    minutes.push(k)
    k = k+1
}

const TimeSelector = (props) => {

    const [tentativeTime_hour, setTentativeTime_hour] = useState('none')
    const [tentativeTime_minute, setTentativeTime_minute] = useState('none')

    function handleSubmit()
    {
        if ((tentativeTime_hour == 'none') || (tentativeTime_minute == 'none')){
            props.handleTimeSubmit('')
            return
        }

        const res = tentativeTime_hour + ':' + tentativeTime_minute

        props.handleTimeSubmit(res)
    }

  return (
    <> 
    <div className="time-selector">
        <label>Hours:</label>
        <select onChange={e => setTentativeTime_hour(e.target.value)}>
            {hours.map(h => {
                let k = h.toString()
                if(k.length < 2){
                    k = '0' + k
                }
                return <option value={k} key={k}>{k}</option>
            })}

        </select>
            
            <label>Minutes:</label>     
            <select onChange={e => setTentativeTime_minute(e.target.value)}>
                {minutes.map(m => {
                    let k = m.toString()
                    if(k.length < 2){
                        k = '0' + k
                    }
                    return <option key={k} value={k}>{k}</option>
                })}
            </select>

        <button onClick={handleSubmit}>Submit</button>

    </div>

    
    </>

  )
}

export default TimeSelector