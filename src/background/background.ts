import {
  setStoragedCities,
  getStoragedCities,
  setStoragedOptions,
  getStoragedOptions,
} from '../utils/storage'

import { fetchOpenWeatherData } from '../utils/api'

chrome.runtime.onInstalled.addListener(() => {
  // TODO: on installed function
  setStoragedCities([])
  setStoragedOptions({
    hasAutoOverlay: false,
    homeCity: '',
    tempScale: 'metric',
  })

  chrome.contextMenus.create({
    contexts: ['selection'],
    title: 'Add city to weather extension',
    id: 'weatherExtension',
  })

  chrome.alarms.create({
    periodInMinutes: 1 / 6,
  })
})

chrome.alarms.onAlarm.addListener(() => {
  getStoragedOptions().then(options => {
    if (options.homeCity === '') {
      return
    }

    fetchOpenWeatherData(options.homeCity, options.tempScale).then(data => {
      const temp = Math.round(data.main.temp)
      const symbol = options.tempScale === 'metric' ? '\u2103' : '\u2109'
      chrome.action.setBadgeText({
        text: `${temp}${symbol}`,
      })
    })
  })
})

chrome.contextMenus.onClicked.addListener(event => {
  getStoragedCities().then(cities => {
    setStoragedCities([...cities, event.selectionText])
  })
})

// getStoragedOptions().then(options => {
//   if (options.homeCity === '') {
//     return
//   }

//   fetchOpenWeatherData(options.homeCity, options.tempScale).then(data => {
//     const temp = Math.round(data.main.temp)
//     const symbol = options.tempScale === 'metric' ? '\u2103' : '\u2109'
//     chrome.action.setBadgeText({
//       text: `${temp}${symbol}`,
//     })
//   })
// })
