import * as _ from "lodash"
import { Key, ReactNode } from "react"

export interface CascaderOptionObject {
  key?: Key
  tabIndex: number
  className?: string
  value?: any
  disabled?: boolean
  children?: ReactNode
}

export interface CascaderTabObject {
  className?: string
  options?: CascaderOptionObject[]
}

export function isActiveOption(option: CascaderOptionObject, values: any[]) {
  return _.get(values, option.tabIndex) === option.value
}
