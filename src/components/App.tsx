import React from 'react'
import WebGL from './WebGL'
import Hero from './Hero'
import Animation from './Animation'
import ThreeSixty from './ThreeSixty'
import Filtering from './Filtering'
import AugReality from './AugReality'
import A11y from './A11y'
import Closing from './Closing'

export const App = (props) => {
  return (
    <>
      <WebGL />
      <Hero />
      <Animation />
      <ThreeSixty />
      <Filtering />
      <AugReality />
      <A11y />
      <Closing />
    </>
  )
}

export default App