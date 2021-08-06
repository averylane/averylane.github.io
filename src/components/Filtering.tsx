import React, { useEffect, useState } from 'react'
import useElementOnScreen from '../helpers/useElementOnScreen'

export const Filtering = (props) => {

  const [containerRef, isVisible] = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: props.threshold
  })

  useEffect(() =>{
    if (isVisible) props.updateCurrent('filt')
  }, [isVisible])

  return (
    <section className="filtering" ref={containerRef}>
      <div className="content">
        <h1>Some ideas just need a little fun.</h1>
      </div>
    </section>
  )
}

export default Filtering