import { SettingsKeyAutoDelete404, SettingsKeyAutoDeleteDay, SettingsKeyFoldItem } from "./constants"

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
}