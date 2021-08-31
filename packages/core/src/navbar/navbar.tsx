import { ArrowLeft } from "@taroify/icons"
import { cloneIconElement } from "@taroify/icons/utils"
import { ITouchEvent, View } from "@tarojs/components"
import classNames from "classnames"
import * as React from "react"
import { isValidElement, ReactNode } from "react"
import { prefixClassname } from "../styles"
import { HAIRLINE_BORDER_BOTTOM } from "../styles/hairline"
import { findChildren } from "../utils/children"

interface NavbarProps {
  bordered?: boolean
  fixed?: boolean
  title?: string
  children?: ReactNode
}

function Navbar(props: NavbarProps) {
  const { bordered, title, children } = props
  const NavLeftRender = findChildren(children, Navbar.NavLeft)
  const NavRightRender = findChildren(children, Navbar.NavRight)
  return (
    <View
      className={classNames(prefixClassname("navbar"), {
        [HAIRLINE_BORDER_BOTTOM]: bordered,
      })}
    >
      <View className={classNames(prefixClassname("navbar__content"))}>
        {NavLeftRender}
        <View className={classNames(prefixClassname("navbar__title"))} children={title} />
        {NavRightRender}
      </View>
    </View>
  )
}

namespace Navbar {
  interface NavLeftProps {
    icon?: ReactNode
    children?: ReactNode

    onClick?(event: ITouchEvent): void
  }

  export function NavLeft(props: NavLeftProps) {
    const { icon = <ArrowLeft />, children, onClick } = props
    return (
      <View className={prefixClassname("navbar__left")} onClick={onClick}>
        {icon && cloneIconElement(icon, { className: prefixClassname("navbar__icon") })}
        {isValidElement(children) ? (
          children
        ) : (
          <View className={prefixClassname("navbar__text")} children={children} />
        )}
      </View>
    )
  }

  interface NavRightProps {
    icon?: ReactNode
    children?: ReactNode

    onClick?(event: ITouchEvent): void
  }

  export function NavRight(props: NavRightProps) {
    const { icon, children, onClick } = props

    return (
      <View className={prefixClassname("navbar__right")} onClick={onClick}>
        {icon && cloneIconElement(icon, { className: prefixClassname("navbar__icon") })}
        {isValidElement(children) ? (
          children
        ) : (
          <View className={prefixClassname("navbar__text")} children={children} />
        )}
      </View>
    )
  }
}

export default Navbar
