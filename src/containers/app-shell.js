import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
// managers
import uiManager from '../managers/ui-manager'
// constants
import uiConst from '../constants/ui'
// components
import ErrorBoundary from '../components/ErrorBoundary'
import MembershipPromo from '../components/membership-promo'
// @twreporter
import Footer from '@twreporter/react-components/lib/footer'
import { Header } from '@twreporter/universal-header/lib/index'
import { BRANCH_PROP_TYPES } from '@twreporter/core/lib/constants/release-branch'
// lodash
import get from 'lodash/get'
import values from 'lodash/values'
const _ = {
  get,
  values,
}

const AppBox = styled.div`
  background-color: ${props => props.backgroundColor};
`

const ContentBlock = styled.div`
  position: relative;
`

const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 1000; // other components in twreporter-react has z-index 999
`

// TODO add `pink` theme to universal-header
const PinkBackgroundHeader = styled.div`
  position: relative;
  background-color: #fabcf0;
`

const renderFooter = (footerType, releaseBranch) => {
  switch (footerType) {
    case uiConst.footer.none: {
      return null
    }
    case uiConst.footer.default:
    default: {
      return <Footer releaseBranch={releaseBranch} />
    }
  }
}

const renderHeader = (
  headerType,
  releaseBranch,
  pathname,
  referrerPath,
  hamburgerContext
) => {
  let headerTheme
  switch (headerType) {
    case uiConst.header.none:
      return null
    case uiConst.header.transparent:
    case uiConst.header.pink:
      headerTheme = 'transparent'
      break
    case uiConst.header.photo:
      headerTheme = 'photography'
      break
    default:
      headerTheme = 'normal'
      break
  }

  let headerElement = (
    <Header
      theme={headerTheme}
      releaseBranch={releaseBranch}
      isLinkExternal={false}
      pathname={pathname}
      referrerPath={referrerPath}
      hamburgerContext={hamburgerContext}
    />
  )

  if (headerType === uiConst.header.pink) {
    headerElement = <PinkBackgroundHeader>{headerElement}</PinkBackgroundHeader>
  }

  return (
    <HeaderContainer className="hidden-print">{headerElement}</HeaderContainer>
  )
}

const AppShell = ({
  headerType = uiConst.header.default,
  footerType = uiConst.footer.default,
  backgroundColor = '#f1f1f1',
  releaseBranch,
  children,
  pathname,
  referrerPath,
}) => {
  const [showHamburger, setShowHamburger] = useState(false)
  const hamburgerContext = { showHamburger, setShowHamburger }

  return (
    <ErrorBoundary>
      <AppBox backgroundColor={backgroundColor}>
        <ContentBlock>
          {renderHeader(
            headerType,
            releaseBranch,
            pathname,
            referrerPath,
            hamburgerContext
          )}
          {children}
          {renderFooter(footerType, releaseBranch)}
        </ContentBlock>
      </AppBox>
      <MembershipPromo
        releaseBranch={releaseBranch}
        pathname={pathname}
        showHamburger={showHamburger}
      />
    </ErrorBoundary>
  )
}
AppShell.propTypes = {
  backgroundColor: PropTypes.string,
  footerType: PropTypes.oneOf(_.values(uiConst.footer)),
  headerType: PropTypes.oneOf(_.values(uiConst.header)),
  releaseBranch: BRANCH_PROP_TYPES,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  pathname: PropTypes.string.isRequired,
  referrerPath: PropTypes.string,
}

function mapStateToProps(state, ownProps) {
  return Object.assign(
    {
      pathname: _.get(ownProps.location, 'pathname', ''),
      referrerPath: _.get(ownProps.referrer, 'pathname', ''),
    },
    uiManager.getLayoutObj(state, ownProps.location)
  )
}

export default connect(mapStateToProps)(AppShell)
