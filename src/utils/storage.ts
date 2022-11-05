import { TempScale } from './api'

export interface LocalStorage {
  cities?: string[]
  options?: LocalStorageOptions
}

export interface LocalStorageOptions {
  homeCity: string
  tempScale: TempScale
  hasAutoOverlay: boolean
}

export type LocalStorageKeys = keyof LocalStorage

export const setStoragedCities = (cities: string[]): Promise<void> => {
  const values: LocalStorage = {
    cities,
  }
  return new Promise(resolve => {
    chrome.storage.local.set(values, () => {
      resolve()
    })
  })
}

export const getStoragedCities = (): Promise<string[]> => {
  const keys: LocalStorageKeys[] = ['cities']
  return new Promise(resolve => {
    chrome.storage.local.get(keys, (res: LocalStorage) => {
      resolve(res.cities ?? [])
    })
  })
}

export const setStoragedOptions = (
  options: LocalStorageOptions
): Promise<void> => {
  const values: LocalStorage = {
    options,
  }
  return new Promise(resolve => {
    chrome.storage.local.set(values, () => {
      resolve()
    })
  })
}

export const getStoragedOptions = (): Promise<LocalStorageOptions> => {
  const keys: LocalStorageKeys[] = ['options']

  return new Promise(resolve => {
    chrome.storage.local.get(keys, (res: LocalStorage) => {
      resolve(res.options)
    })
  })
}
