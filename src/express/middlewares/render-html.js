import App from '../../app'
import Html from '../../helpers/Html'
import Loadable from 'react-loadable'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import get from 'lodash/get'
import { Provider } from 'react-redux'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import { StaticRouter } from 'react-router-dom'
import { getBundles } from 'react-loadable/webpack'

const _ = {
  get
}

/**
 *  This middleware composes html static markup according to redux store.
 *  It updates router context into `req[namespace].routerStaticContext`
 *  and html markup string into `req[namespace].html`.
 *
 *  @param {string} namespace - namespace is used in `req` object to avoid from overwriting the existed field
 *  @param {Object} webpackAssets - webpack assets defined in webpack-assets.json
 *  @param {Object} webpackAssets.javascripts
 *  @param {string} webpackAssets.javascripts.main
 *  @param {[]string} webpackAssets.stylesheets
 *  @param {Object} loadableStats - JSON file generated by react-loadable/webpack plugin
 *  @param {Object} options
 *  @param {string} options.releaseBranch - release branch, it could be 'master', 'test', 'staging' or 'release'
 */
function renderHTMLMiddleware(namespace, webpackAssets, loadableStats, options) {
  return function middleware(req, res, next) {
    const modules = []
    const store = _.get(req, [ namespace, 'reduxStore' ])
    if (!store) {
      next(new Error(`req.${namespace}.reduxStore is not existed`))
      return
    }

    const routerStaticContext = {}
    const sheet = new ServerStyleSheet()
    const contentMarkup = ReactDOMServer.renderToString(
      <Provider store={store} >
        <StyleSheetManager sheet={sheet.instance}>
          <StaticRouter
            location={req.url}
            context={routerStaticContext}
          >
            <Loadable.Capture report={moduleName => modules.push(moduleName)}>
              <App releaseBranch={options.releaseBranch}/>
            </Loadable.Capture>
          </StaticRouter>
        </StyleSheetManager>
      </Provider>
    )

    const bundles = getBundles(loadableStats, modules)
    const scripts = bundles.map((bundle) => {
      return _.get(bundle, 'publicPath', '')
    })
    // manifest file should be loaded first
    scripts.unshift(webpackAssets.javascripts.manifest)

    // main bundle should be last
    scripts.push(webpackAssets.javascripts.main)

    const html = ReactDOMServer.renderToString(
      <Html
        contentMarkup={contentMarkup}
        store={store}
        scripts={scripts}
        styles={webpackAssets.stylesheets}
        styleElement={sheet.getStyleElement()}
      />
    )

    req[namespace].routerStaticContext = routerStaticContext
    req[namespace].html = `<!doctype html>${html}`

    next()
  }
}

export default renderHTMLMiddleware
