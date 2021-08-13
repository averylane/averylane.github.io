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
        <h1 tabIndex="0">Come work with us</h1>
        <h3 tabIndex="0">We do AR/VR/App interactive experiences.</h3>
        <p tabIndex="0">We specialize in React, Typescript, React Native, Frontend Testing Strategies, React Native, Electron, and Functional+Reactive Programming Paradigms.</p>
        <p tabIndex="0">Contact us at contact@averylane.dev.</p>
      </div>
    </section>
  )
}

export default Closing