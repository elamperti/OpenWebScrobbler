import React, { Suspense, useEffect } from 'react'
import { Route, Redirect, Switch, useLocation, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { changeLanguage } from 'i18next'
import qs from 'qs'
import find from 'lodash/find'

import { interceptAxios } from 'utils/axios'
import {languageList, fallbackLng} from 'utils/i18n'

import { authUserWithToken, getUserInfo } from 'store/actions/userActions'

import PrivateRoute from './components/PrivateRoute'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import AlertZone from './components/AlertZone'
import AnalyticsListener from './components/AnalyticsListener'
import UpdateToast from './components/UpdateToast'

import Home from 'domains/home'
import ScrobbleSong from './views/ScrobbleSong'
import ScrobbleAlbum from './views/ScrobbleAlbum'
import ScrobbleUser from './views/ScrobbleUser'
import Spinner from 'components/Spinner'


function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()

  const versionUpdateReady = useSelector(state => state.updates.newVersionReady)
  const isLoggedIn = useSelector(state => state.user.isLoggedIn)

  useEffect(() => {
    const queryString = qs.parse(location.search, { ignoreQueryPrefix: true })

    interceptAxios(dispatch)

    if (location.search && !isLoggedIn) {
      const token = queryString.token || null
      if (token) {
        history.push('/') // Clear the URL
        authUserWithToken(dispatch)(token)
      }
    } else {
      getUserInfo(dispatch)()
    }

    // ToDo: Move this to a better place
    if (queryString.hl) {
      if ((find(languageList, {code: queryString.hl}) || Object.prototype.hasOwnProperty.call(fallbackLng, queryString.hl))) {
        changeLanguage(queryString.hl)
      }
    }
  })

  const loadingSpinner = (
    <div id="ows-loading">
      <Spinner />
    </div>
  )

  return (
    <Suspense fallback={loadingSpinner}>
      <Navigation />
      <div className="d-flex flex-column" style={{height: 'calc(100vh - 78px)'}}>
        { process.env.REACT_APP_ANALYTICS_CODE ? <AnalyticsListener /> : null }
        { versionUpdateReady ? <UpdateToast /> : null }

        <div className="container">
          <AlertZone />
        </div>
        <main className="container flex-wrap flex-grow-1">
          <Switch>
            <PrivateRoute exact path="/scrobble/song" component={ScrobbleSong} />
            <PrivateRoute exact path="/scrobble/album" component={ScrobbleAlbum} />
            <PrivateRoute exact path="/scrobble/user/:username?" component={ScrobbleUser} />
            <Route exact path="/" component={Home} />
            <Redirect to="/" />
          </Switch>
        </main>
        <Footer />
      </div>
    </Suspense>
  )
}

export default App
