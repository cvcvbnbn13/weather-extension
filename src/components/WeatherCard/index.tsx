import React, { useEffect, useState } from 'react'
import {
  fetchOpenWeatherData,
  IOpenWeatherData,
  TempScale,
  getWeatherIcon,
} from '../../utils/api'
import {
  Card,
  CardContent,
  Button,
  CardActions,
  Typography,
  Box,
  Grid,
} from '@mui/material'
import './index.css'

interface IProps {
  city: string
  tempScale: TempScale
  onDelete?: () => void
}

type WeatherCardState = 'loading' | 'error' | 'success'

const WeatherCardContainer: React.FC<{
  children: React.ReactNode
  onDelete: () => void
}> = ({ children, onDelete }) => {
  return (
    <Box
      sx={{
        marginY: '1.5rem',
      }}
    >
      <Card>
        <CardContent>{children}</CardContent>
        <CardActions>
          {onDelete && (
            <Button onClick={onDelete} color="secondary">
              <Typography className="weatherCard-body">Delete</Typography>
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  )
}

const WeatherCard: React.FC<IProps> = ({ city, onDelete, tempScale }) => {
  const [weatherData, setWeatherData] = useState<IOpenWeatherData | null>(null)
  const [cardState, setCardState] = useState<WeatherCardState>('loading')

  useEffect(() => {
    fetchOpenWeatherData(city, tempScale)
      .then(data => {
        setWeatherData(data)
        setCardState('success')
      })
      .catch(error => {
        console.error(error)
        setCardState('error')
      })
  }, [city, tempScale])

  if (cardState === 'loading' || cardState === 'error') {
    return (
      <WeatherCardContainer onDelete={onDelete}>
        <Typography className="weatherCard-title">{city}</Typography>
        <Typography className="weatherCard-body">
          {cardState === 'loading' ? 'Loading...' : 'Error: 查無此城市'}
        </Typography>
      </WeatherCardContainer>
    )
  }

  return (
    <WeatherCardContainer onDelete={onDelete}>
      <Grid container justifyContent="space-around" alignItems="center">
        <Grid item>
          <Typography
            className="weatherCard-title"
            variant="h5"
            marginBottom={2}
          >
            {weatherData.name}
          </Typography>
          <Typography className="weatherCard-body">
            溫度: {Math.round(weatherData.main.temp)}°C
          </Typography>
          <Typography variant="body1">
            體感溫度: {Math.round(weatherData.main.feels_like)}°C
          </Typography>
        </Grid>
        <Grid item>
          {weatherData.weather.length > 0 && (
            <>
              <img src={getWeatherIcon(weatherData.weather[0].icon)} alt="" />
              <Typography textAlign="center">
                {weatherData.weather[0].description}
              </Typography>
            </>
          )}
        </Grid>
      </Grid>
    </WeatherCardContainer>
  )
}

export default WeatherCard
