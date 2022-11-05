import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './popup.css'
import { WeatherCard } from '../components'
import 'fontsource-roboto'
import { Messages } from '../utils/message'
import {
  InputBase,
  Grid,
  IconButton,
  Paper,
  Box,
  Typography,
} from '@mui/material'
import {
  Add as AddIcon,
  PictureInPicture as PictureIcon,
} from '@mui/icons-material'
import {
  setStoragedCities,
  getStoragedCities,
  setStoragedOptions,
  getStoragedOptions,
  LocalStorageOptions,
} from '../utils/storage'

const App: React.FC<{}> = () => {
  const [cities, setCities] = useState<string[]>([])

  const [weatherOptions, setWeatherOptions] =
    useState<LocalStorageOptions | null>(null)

  const [cityInput, setCityInput] = useState<string>('')

  const handleInput = e => {
    setCityInput(e.target.value)
  }

  const handleButtonClick = () => {
    if (cityInput === '') {
      return
    }
    const updatedCities = [...cities, cityInput]
    setStoragedCities(updatedCities).then(() => {
      setCities(updatedCities)
      setCityInput('')
    })
  }

  const handleDeleteCity = (index: number) => {
    const updatedCities = cities.filter(item => item !== cities[index])
    setStoragedCities(updatedCities).then(() => {
      setCities([...updatedCities])
    })
  }

  const handleTempleScaleChange = () => {
    const updatedOptions: LocalStorageOptions = {
      ...weatherOptions,
      tempScale: weatherOptions.tempScale === 'metric' ? 'imperial' : 'metric',
    }
    setStoragedOptions(updatedOptions).then(() => {
      setWeatherOptions(updatedOptions)
    })
  }

  const handleSwitchToOverlay = () => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      tabs => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, Messages.TOGGLE_OVERLAY)
        }
      }
    )
  }

  useEffect(() => {
    getStoragedCities().then(cities => setCities(cities))
    getStoragedOptions().then(options => setWeatherOptions(options))
  }, [])

  if (!weatherOptions) {
    return null
  }

  return (
    <Box
      sx={{
        marginX: '8px',
        marginY: '16px',
      }}
    >
      <Grid container justifyContent="space-evenly">
        <Grid item>
          <Paper>
            <Box
              sx={{
                paddingX: '15px',
                paddingY: '5px',
              }}
            >
              <InputBase
                placeholder="請輸入城市英文名"
                value={cityInput}
                onChange={handleInput}
              />
              <IconButton onClick={handleButtonClick}>
                <AddIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box py={'3px'}>
              <IconButton onClick={handleTempleScaleChange}>
                {weatherOptions.tempScale === 'metric' ? '\u2103' : '\u2109'}
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box py={'5px'}>
              <IconButton
                onClick={handleSwitchToOverlay}
                disabled={cities.length === 0 && !weatherOptions.homeCity}
              >
                <PictureIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {weatherOptions.homeCity !== '' && (
        <Box>
          <Typography mb={-2} mt={2} variant="caption" display="block">
            預設城市
          </Typography>
          <WeatherCard
            city={weatherOptions.homeCity}
            tempScale={weatherOptions.tempScale}
          />
        </Box>
      )}
      {cities.map((city, index) => {
        return (
          <WeatherCard
            city={city}
            tempScale={weatherOptions.tempScale}
            key={city}
            onDelete={() => handleDeleteCity(index)}
          />
        )
      })}
    </Box>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
