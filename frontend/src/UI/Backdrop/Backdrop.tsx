import React, { MouseEventHandler } from 'react'
import './Backdrop.css'
type Props = {
  show?: Boolean,
  clicked: MouseEventHandler
}
const backdrop: React.FC<Props> = ({ show, clicked }) => {

  return (
    show ? <div
      className="Backdrop"
      onClick={(e) => {e.stopPropagation() ; clicked(e)}}
    ></div> : null
  )
}
export default backdrop