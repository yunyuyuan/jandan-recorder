import { SettingsKeyAutoDelete404, SettingsKeyAutoDeleteDay, SettingsKeyFoldItem, SettingsKeyRGBName } from "./constants"

export type ListItem = {
  isCreate: boolean,
  url: string,
  urlWithAnchor: string,
  content: string,
  timestamp: number,
  lastCheck404?: number,
  oo?: number,
  xx?: number,
  approved?: boolean,
  isChild?: boolean,
  childrenNum?: number
}

export type Settings = {
  [SettingsKeyAutoDeleteDay]: string,
  [SettingsKeyAutoDelete404]: boolean,
  [SettingsKeyFoldItem]: boolean,
  [SettingsKeyRGBName]: boolean
}

export type UserData = {
  id?: number,
  nickname?: string,
  username?: string,
}