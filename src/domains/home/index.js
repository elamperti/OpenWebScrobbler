import React, {useEffect} from 'react'
import { PropTypes } from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import i18n, { languageList, fallbackLng } from 'i18n' // to handle hl parameter
import qs from 'qs'
import find from 'lodash/find'
import { authUserWithToken } from 'store/actions/userActions'
import HomeUser from 'domains/home/HomeUser'
import HomeVisitor from 'domains/home/HomeVisitor'

import './index.scss'

const bodyDecoration = 'with-shadow'

export default function Home({
  location,
  history,
  lang,
}) {
  const isLoggedIn = useSelector(state => state.user.isLoggedIn)
  const dispatch = useDispatch()

  useEffect(() => {
    // Add body class for special home background
    document.body.classList.add(bodyDecoration)

    if (location.search) {
      if (!isLoggedIn) {
        const token = qs.parse(location.search, { ignoreQueryPrefix: true }).token || null
        if (token) {
          history.push('/') // Clear the URL
          authUserWithToken(dispatch)(token, () => history.push('/scrobble/song'))
        }
      }

      if (!lang || lang === 'auto') {
        const suggestedLang = qs.parse(location.search, { ignoreQueryPrefix: true }).hl || null
        if (suggestedLang && (find(languageList, {code: suggestedLang}) || Object.prototype.hasOwnProperty.call(fallbackLng, suggestedLang))) {
          i18n.changeLanguage(suggestedLang)
        }
      }
    }

    return () => { // unmount
      document.body.classList.remove(bodyDecoration)
    }
  }, [isLoggedIn])

  return isLoggedIn ? <HomeUser /> : <HomeVisitor />
}

Home.propTypes = {
  history: PropTypes.object,
  lang: PropTypes.string,
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
}
