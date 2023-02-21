import React, { useState } from "react"
import './index.css'

const App = () => {
    const [counter, setCounter] = useState(0)
    const [values, setValues] = useState([])

    const handleCLick = () => {
        setCounter(counter + 1)
        setValues(values.concat(counter))
    }

    return (
        <div className="container">
            hello webpack {counter} clicks
            <button onClick={handleCLick}>
                press
            </button>
        </div>
    )
}

export default App