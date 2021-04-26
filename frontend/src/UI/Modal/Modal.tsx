import React, { Fragment, MouseEventHandler  } from 'react';
import './Modal.css'
import Backdrop from '../Backdrop/Backdrop'
type Props = {
  show: Boolean,
  modalClosed?: MouseEventHandler , 
  className? : any
}
const Modal: React.FC<Props> = ({ children , show, modalClosed , className }: any) => {

  return (
    <Fragment>
      <Backdrop show={show} clicked={modalClosed} />
      <div className = {`Modal ${className}`}
        style={{
          transform: show ? 'translateY(0)' : 'translateY(-100vh)',
          opacity: show ? '1' : '0'
        }}
      >
        {children}
      </div>
    </Fragment>
  )
}

export default Modal;