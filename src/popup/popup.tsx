import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import './popup.css'
import { fetchOpenWeatherData } from '../utils/api'

const App: React.FC<{}> = () => {
  useEffect(() => {
    fetchOpenWeatherData('Taipei')
      .then(data => {
        console.log(data)
      })
      .catch(error => {
        console.error(error)
      })
  }, [])

  return (
    <div>
      <img src="icon.png" />
    </div>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
