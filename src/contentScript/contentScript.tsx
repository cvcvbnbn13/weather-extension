import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { WeatherCard } from '../components'
import { Card } from '@mui/material'
import { getStoragedOptions, LocalStorageOptions } from '../utils/storage'
import { Messages } from '../utils/message'
import './contentScript.css'

const App: React.FC<{}> = () => {
  const [weatherOptions, setWeatherOptions] =
    useState<LocalStorageOptions | null>(null)

  const [isActive, setIsActive] = useState<boolean>(false)

  useEffect(() => {
    getStoragedOptions().then(options => {
      setWeatherOptions(options)
      setIsActive(options.hasAutoOverlay)
    })
  }, [])

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg === Messages.TOGGLE_OVERLAY) {
        setIsActive(!isActive)
      }
      sendResponse({
        received: true,
      })
    })
  }, [isActive])

  if (!weatherOptions) {
    return null
  }

  return (
    <>
      {isActive && (
        <Card className="overlayCard">
          <WeatherCard
            city={weatherOptions.homeCity}
            tempScale="metric"
            onDelete={() => setIsActive(false)}
          />
        </Card>
      )}
    </>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
