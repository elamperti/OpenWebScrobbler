import React, {useEffect} from 'react'
import { useSelector } from 'react-redux'

import HomeUser from 'domains/home/HomeUser'
import HomeVisitor from 'domains/home/HomeVisitor'

import './index.scss'

const bodyDecoration = 'with-shadow'

export default function Home() {
  const isLoggedIn = useSelector(state => state.user.isLoggedIn)

  useEffect(() => {
    // Add body class for special home background
    // ToDo: get rid of this unholy hack
    document.body.classList.add(bodyDecoration)

    return () => { // unmount
      document.body.classList.remove(bodyDecoration)
    }
  })

  return isLoggedIn ? <HomeUser /> : <HomeVisitor />
}
