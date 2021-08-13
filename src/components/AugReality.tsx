import React, { useEffect, useState } from 'react'
import useElementOnScreen from '../helpers/useElementOnScreen'

export const AugReality = (props) => {

  const [containerRef, isVisible] = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: props.threshold
  })

  useEffect(() =>{
    if (isVisible) props.updateCurrent('augr')
  }, [isVisible])

  return (
    <section className="ar" ref={containerRef}>
      <div className="content">
        <h1 tabIndex="0">Some Ideas Needs Reality.</h1>
      </div>
    </section>
  )
}

export default AugReality