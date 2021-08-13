import React, { useEffect, useState } from 'react'
import useElementOnScreen from '../helpers/useElementOnScreen'

export const ThreeSixty = (props) => {

  const [containerRef, isVisible] = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: props.threshold
  })

  useEffect(() =>{
    if (isVisible) props.updateCurrent('360d')
  }, [isVisible])

  return (
    <section className="three-sixty" ref={containerRef}>
      <div className="content">
        <h1 tabIndex="0">Some ideas need 360 degrees of dimension</h1>
      </div>
    </section>
  )
}

export default ThreeSixty