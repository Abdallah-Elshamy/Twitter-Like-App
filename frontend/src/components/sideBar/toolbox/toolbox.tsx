import React, { Fragment } from 'react';

interface toolProps {
  className?: string;
  children?: any;
  design?:any;
}

export class ToolBox extends React.Component<toolProps>  {
toggleContainer:any =  React.createRef<HTMLDivElement>();
state = {
        isOpen: true,
    };

  constructor(props :any) {
    super(props);
    this.state = { isOpen: false };
    this.toggleContainer  =  React.createRef();

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
  }
  
  onClickHandler = (e: any) => {
      e.stopPropagation();
      if (this.state.isOpen  ){
          this.setState({ isOpen: false });
      }
      else {
          this.setState({ isOpen: true });
      }
  };
    componentDidMount() {
        document.addEventListener("mousedown", this.onClickOutsideHandler);
    }
    componentWillUnmount() {
      document.removeEventListener("mousedown", this.onClickOutsideHandler);
    }


    onClickOutsideHandler(event : any ) {
      if (this.state.isOpen && !this.toggleContainer.current.contains(event.target)) {
        this.setState({ isOpen: false });
      }
    }
  
    handleClose = (event:any ) => {
      this.setState({ isOpen: false  });
      this.onClickHandler(event);
      event.stopPropagation();
  }


    render() {
      return (
        <Fragment>
        <div className="flex-initial relative "  ref={this.toggleContainer}>
         {this.state.isOpen && (
          <div>
           { this.props.children}
          </div>
        )}
 <div>
      <a className= {`${this.props.className}`} onClick={(e) => {this.handleClose(e); }} >
        <div>
      { this.props.design}
      </div>
       </a>
  </div>
 </div>
 </Fragment>
      );
    }
  }