import React, { useEffect, useState } from 'react'
import useElementOnScreen from '../helpers/useElementOnScreen'

export const Animation = (props) => {

  const [containerRef, isVisible] = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: props.threshold
  })

  useEffect(() =>{
    if (isVisible) props.updateCurrent('anim')
  }, [isVisible])

  return (
    <section className="twoD-threeD" ref={containerRef}>
      <div className="content">
        <h1>Some ideas needs simple dimensions</h1>
      </div>
    </section>
  )
}

export default Animation