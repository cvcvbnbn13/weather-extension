import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Switch,
  Box,
  FormControlLabel,
} from '@mui/material'
import 'fontsource-roboto'
import './options.css'
import {
  setStoragedOptions,
  getStoragedOptions,
  LocalStorageOptions,
} from '../utils/storage'

type FormState = 'ready' | 'saving'

const App: React.FC<{}> = () => {
  const [weatherOptions, setWeatherOptions] =
    useState<LocalStorageOptions | null>(null)

  const [formState, setFormState] = useState<FormState>('ready')

  useEffect(() => {
    getStoragedOptions().then(options => {
      setWeatherOptions(options)
    })
  }, [])

  const handleChangeHomeCity = event => {
    setWeatherOptions({ ...weatherOptions, homeCity: event.target.value })
  }

  const handleSaveHomeCity = () => {
    setFormState('saving')
    setStoragedOptions(weatherOptions).then(() => {
      setTimeout(() => {
        setFormState('ready')
      }, 1000)
    })
  }

  const handleAutoOverlaySwitch = (hasAutoOverlay: boolean) => {
    setWeatherOptions({ ...weatherOptions, hasAutoOverlay })
  }

  if (!weatherOptions) {
    return null
  }

  const isFieldDisabled = formState === 'saving'

  return (
    <Box
      sx={{
        marginX: '10%',
        marginY: '2%',
      }}
    >
      <Card>
        <CardContent>
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <Typography variant="h4">Weather Extension Options</Typography>
            </Grid>
            <Grid item>
              <TextField
                id="standard-basic"
                variant="standard"
                label="請輸入預設城市"
                fullWidth
                onChange={handleChangeHomeCity}
                value={weatherOptions.homeCity}
                disabled={isFieldDisabled}
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={weatherOptions.hasAutoOverlay}
                    onChange={(event, checked) =>
                      handleAutoOverlaySwitch(checked)
                    }
                    disabled={isFieldDisabled}
                  />
                }
                label="Auto Toggle overlay"
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveHomeCity}
                disabled={isFieldDisabled}
              >
                {formState === 'ready' ? '確認' : '保存中...'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
