import Footer from '@twreporter/react-components/lib/footer'
import React from 'react'
import styled from 'styled-components'
import uh from '@twreporter/universal-header'
import { colors } from '../themes/common-variables'
import { screen } from '../themes/screen'
import { themesConst } from './theme-manager'

const HeaderContainerWithTransparentTheme = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  ${screen.desktopBelow`
    position: relative;
  `}
`

const styles = {
  normal: {
    backgroundColor: colors.gray.lightGray
  },
  photography: {
    backgroundColor: colors.photographyColor
  },
  articlePage: {
    fullscreen: {
      dark: {
        backgroundColor: '#2c2c2c'
      },
      normal: {
        backgroundColor: colors.gray.lightGray
      }
    }
  }
}

export default class LayoutManager {
  /**
   *  @param {Object} props
   *  @param {string} props.releaseBranch - 'master', 'test', 'staging' or 'release'
   *  @param {string} props.theme - check out `themesConst` for more information
   */
  constructor({ releaseBranch='master', theme=themesConst.normal }) {
    this.releaseBranch = releaseBranch
    this.theme = theme
  }


  /**
   *  @return {string} theme
   */
  getTheme() {
    return this.theme
  }

  /**
   *  @return {Object} Header JSX component
   */
  getHeader() {
    if (this.theme === themesConst.withoutHeader
      || this.theme === themesConst.withoutHeaderAndFooter) {
      return null
    }
    switch(this.theme) {
      case themesConst.withoutHeader:
      case themesConst.withoutHeaderAndFooter: {
        return null
      }
      case themesConst.articlePage.fullscreen.dark:
      case themesConst.articlePage.fullscreen.normal: {
        return (
          <HeaderContainerWithTransparentTheme>
            <uh.Header
              theme="transparent"
              releaseBranch={this.releaseBranch}
              isLinkExternal={false}
            />
          </HeaderContainerWithTransparentTheme>
        )
      }
      // TODO Header of topic page should be implmeneted here, rather than in topicLandingPage container
      //case themesConst.topicPage.fullscreen.dark:
      //case themesConst.topicPage.fullscreen.normal: {
      //}
      default: {
        return (
          <uh.Header
            theme={this.theme}
            releaseBranch={this.releaseBranch}
            isLinkExternal={false}
          />
        )
      }
    }

  }

  /**
   * @return {Object} JSX Footer Component
   */
  getFooter() {
    if (this.theme === themesConst.withoutHeaderAndFooter) {
      return null
    }
    return <Footer />
  }

  /**
   *  @return {string} background color
   */
  getBackgroundColor() {
    switch(this.theme) {
      case themesConst.photography: {
        return styles.photography.backgroundColor
      }
      case themesConst.articlePage.fullscreen.dark: {
        return styles.articlePage.fullscreen.dark.backgroundColor
      }
      case themesConst.articlePage.fullscreen.normal: {
        return styles.articlePage.fullscreen.normal.backgroundColor
      }
      default: {
        return styles.normal.backgroundColor
      }
    }
  }
}

