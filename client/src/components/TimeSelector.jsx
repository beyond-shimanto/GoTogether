import React, { useEffect } from 'react'
import { useState } from 'react'
import './css/TimeSelector.css'

const hours = []
let i = 0
while (i <= 24){
    hours.push(i)
    i = i+1
}
const minutes = []
let k = 0
while (k <= 60){
    minutes.push(k)
    k = k+1
}

const TimeSelector = (props) => {

    const [tentativeTime_hour, setTentativeTime_hour] = useState(0)
    const [tentativeTime_minute, setTentativeTime_minute] = useState(0)

    useEffect(()=> {
        handleSubmit()
    }, [tentativeTime_hour, tentativeTime_minute])

    function handleSubmit()
    {
        const timeString = `${String(tentativeTime_hour).padStart(2, "0")}:${String(tentativeTime_minute).padStart(2, "0")}`;        

        props.handleTimeSubmit(timeString)
    }

  return (
    <> 
    <div className="time-selector">
        <p>Hours</p>
        <div className="wheel">
        {hours.map((h) => (
          <div
            key={h}
            className={`option ${h == tentativeTime_hour ? "selected" : ""}`}
            onClick={() => setTentativeTime_hour(h)}
          >
            {String(h).padStart(2,'0')}
          </div>
        ))}
      </div>
        <span className="colon">:</span>

      <div className="wheel">
        {minutes.map((m) => (
          <div
            key={m}
            className={`option ${m == tentativeTime_minute ? "selected" : ""}`}
            onClick={() => setTentativeTime_minute(m)}
          >
            {String(m).padStart(2, '0')}
          </div>
        ))}
      </div>
        <p>Minutes</p>

    </div>

    
    </>

  )
}

export default TimeSelector



