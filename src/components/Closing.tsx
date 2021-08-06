import React, { useEffect, useState } from 'react'
import useElementOnScreen from '../helpers/useElementOnScreen'

export const Closing = (props) => {

  const [containerRef, isVisible] = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: props.threshold
  })

  useEffect(() =>{
    if (isVisible) props.updateCurrent('clos')
  }, [isVisible])

  return (
    <section className="closing" ref={containerRef}>
      <div className="content">
        <h1>Come work with us</h1>
        <h3>We do AR/VR/App interactive experiences.</h3>
        <p>We specialize in React, Typescript, React Native, Frontend Testing Strategies, React Native, Electron, and Functional+Reactive Programming Paradigms.</p>
        <p>Contact us at contact@averylane.dev.</p>
      </div>
    </section>
  )
}

export default Closing