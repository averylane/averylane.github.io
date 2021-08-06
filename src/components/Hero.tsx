import React, { useRef, useState, useEffect } from 'react'
import useElementOnScreen from '../helpers/useElementOnScreen'

export const Hero = (props) => {

  const [containerRef, isVisible] = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: props.threshold
  })

  useEffect(() =>{
    if (isVisible) props.updateCurrent('hero')
  }, [isVisible])

  return (
    <section className="hero" ref={containerRef}>
      <div className="content">
        <h1>Big ideas need big mediums</h1>
      </div>
    </section>
  )
}

export default Hero