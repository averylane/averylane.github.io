import React, { useEffect, useState } from 'react'
import Hero from './Hero'
import Animation from './Animation'
import ThreeSixty from './ThreeSixty'
import Filtering from './Filtering'
import AugReality from './AugReality'
import A11y from './A11y'
import Closing from './Closing'

export const App = (props) => {

  const threshold = 0.7

  const [current, updateCurrent] = useState('hero')

  useEffect(() => {
    // console.log(current)
    window.current = current
  }, [current])

  return (
    <>
      <Hero updateCurrent={updateCurrent} threshold={threshold}/>
      <Animation updateCurrent={updateCurrent} threshold={threshold}/>
      <ThreeSixty updateCurrent={updateCurrent} threshold={threshold}/>
      <Filtering updateCurrent={updateCurrent} threshold={threshold}/>
      <AugReality updateCurrent={updateCurrent} threshold={threshold}/>
      <A11y updateCurrent={updateCurrent} threshold={threshold}/>
      <Closing updateCurrent={updateCurrent} threshold={threshold}/>
    </>
  )
}

export default App