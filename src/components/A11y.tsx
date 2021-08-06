import React, { useEffect, useState } from 'react'
import useElementOnScreen from '../helpers/useElementOnScreen'

export const A11y = (props) => {

  const [containerRef, isVisible] = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: props.threshold
  })

  useEffect(() =>{
    if (isVisible) props.updateCurrent('a11y')
  }, [isVisible])

  return (
    <section className="a11y" ref={containerRef}>
      <div className="content" >
        <h1>All Ideas Should Be Inclusive</h1>
      </div>
    </section>
  )
}

export default A11y