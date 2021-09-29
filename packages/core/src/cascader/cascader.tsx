import { Cross } from "@taroify/icons"
import { ITouchEvent, View } from "@tarojs/components"
import { nextTick } from "@tarojs/taro"
import classNames from "classnames"
import * as _ from "lodash"
import * as React from "react"
import {
  Children,
  isValidElement,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { prefixClassname } from "../styles"
import Tabs from "../tabs"
import CascaderHeader from "./cascader-header"
import CascaderOption from "./cascader-option"
import CascaderOptionBase from "./cascader-option-base"
import CascaderTab from "./cascader-tab"
import CascaderContext from "./cascader.context"
import { CascaderOptionObject, CascaderTabObject, isActiveOption } from "./cascader.shared"

function getCascaderOptions(children: ReactNode, tabIndex: number): CascaderOptionObject[] {
  const options: CascaderOptionObject[] = []
  Children.forEach(children, (child: ReactNode) => {
    if (isValidElement(child)) {
      const element = child as ReactElement
      const { key, props, type } = element
      if (type === CascaderOption) {
        const index = _.size(options)
        options.push({
          key: key ?? index,
          tabIndex,
          ...props,
        })
      }
    }
  })

  return options
}

interface CascaderChildren {
  header?: ReactNode
  tabs: CascaderTabObject[]
}

function useCascaderChildren(children?: ReactNode): CascaderChildren {
  const __children__: CascaderChildren = {
    header: undefined,
    tabs: [],
  }

  Children.forEach(children, (child: ReactNode) => {
    if (isValidElement(child)) {
      const element = child as ReactElement
      const { props, type } = element
      if (type === CascaderHeader) {
        __children__.header = element
      } else if (type === CascaderTab) {
        const { children } = props
        __children__.tabs.push({
          options: getCascaderOptions(children, _.size(__children__.tabs)),
        })
      }
    }
  })
  return __children__
}

export interface CascaderProps {
  className?: string
  title?: ReactNode
  value?: any[]
  placeholder?: ReactNode
  swipeable?: boolean
  closeable?: boolean
  closeIcon?: ReactNode
  children?: ReactNode

  onChange?(values: any[]): void

  onSelect?(values: any[]): void

  onTabClick?(event: Tabs.TabEvent): void

  onClose?(event: ITouchEvent): void
}

function Cascader(props: CascaderProps) {
  const {
    className,
    title,
    value = [],
    placeholder = "请选择",
    closeable = true,
    closeIcon = <Cross />,
    onChange,
    onSelect,
    onTabClick,
    onClose,
  } = props
  const { header = <CascaderHeader />, tabs } = useCascaderChildren(props.children)

  const [values, setValues] = useState<any[]>([])

  const [activeTab, setActiveTab] = useState(0)

  const lastTab = useMemo(() => _.size(tabs) - 1, [tabs])

  const activeTabs = useMemo(() => _.slice(tabs, 0, _.size(values) + 1), [tabs, values])

  const activeLabels = useMemo(
    () =>
      _.map(
        tabs,
        ({ options }) =>
          _.find(options, (option) => option.value === values[option.tabIndex])?.children,
      ),
    [tabs, values],
  )

  const handleSelect = useCallback(
    (option: CascaderOptionObject) => {
      const { disabled, tabIndex, value } = option
      if (disabled) {
        return
      }

      const newValues = _.slice(values, 0, tabIndex + 1)

      newValues[tabIndex] = value
      setValues(newValues)
    },
    [values],
  )

  useEffect(() => {
    nextTick(() => {
      setActiveTab(_.clamp(_.size(values), lastTab))
    })
  }, [lastTab, values])

  useEffect(() => {
    if (!_.isEqual(values, value)) {
      onSelect?.(values)
      if (_.size(tabs) === _.size(values)) {
        onChange?.(values)
      }
    }
  }, [onChange, onSelect, tabs, value, values])

  useEffect(() => {
    setValues(value)
  }, [value])

  return (
    <View className={classNames(prefixClassname("cascader"), className)}>
      <CascaderContext.Provider
        value={{
          title,
          closeable,
          closeIcon,
          onClose,
        }}
        children={header}
      />
      <Tabs
        className={prefixClassname("cascader__tabs")}
        value={activeTab}
        swipeable
        onChange={(value) => setActiveTab(value)}
        onTabClick={onTabClick}
      >
        {
          //
          _.map(activeTabs, (tab, index) => (
            <Tabs.TabPane
              key={index}
              value={index}
              title={_.get(activeLabels, index) ?? placeholder}
              titleClassName={classNames(prefixClassname("cascader__tab"), {
                [prefixClassname("cascader__tab--inactive")]: _.isEmpty(_.get(activeLabels, index)),
              })}
            >
              <View className={prefixClassname("cascader__options")}>
                {
                  //
                  _.map(tab.options, (option) => (
                    <CascaderOptionBase
                      key={option.key}
                      className={option.className}
                      active={isActiveOption(option, values)}
                      disabled={option.disabled}
                      children={option.children ?? option.value}
                      onClick={() => handleSelect(option)}
                    />
                  ))
                }
              </View>
            </Tabs.TabPane>
          ))
        }
      </Tabs>
    </View>
  )
}

export default Cascader
