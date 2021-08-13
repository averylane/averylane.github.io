import React, { useEffect, useState } from 'react'
import useElementOnScreen from '../helpers/useElementOnScreen'

export const Filtering = (props) => {

  const [containerRef, isVisible] = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: props.threshold
  })

  var [filter, changeFilter] = useState('disguise')

  useEffect(() =>{
    if (isVisible) props.updateCurrent('filt')
  }, [isVisible])

  // useEffect(()=> {
  //   changeFilter(window.currentFilter)
  //   console.log('hello')
  // }, [window.currentFilter])

  return (
    <section className="filtering" ref={containerRef}>
      <div className="content">
        <h1 tabIndex="0">Some ideas just need a little fun.</h1>
        <button className={`filterBtn ${filter==='disguise' ? 'selected' : ''}`}
          onClick={() => {
            window.currentFilter = 'disguise'
            changeFilter('disguise')
          }}>Disguise</button>
        <button className={`filterBtn ${filter==='eyes' ? 'selected' : ''}`}
          onClick={() => {
            window.currentFilter = 'eyes'
            changeFilter('eyes')
          }}>Anime Eyes</button>
        <button className={`filterBtn ${filter==='funglasses' ? 'selected' : ''}`}
          onClick={() => {
            window.currentFilter = 'funglasses'
            changeFilter('funglasses')
          }}>Funglasses</button>
      </div>
    </section>
  )
}

export default Filtering