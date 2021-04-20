import React from 'react';
import { Logout } from '../../Register/logout/logout';
// import './flootProfile.css';



interface toolProps {
  className?: string;
  children ?: any;
  design?:any;
}

export class ToolBox extends React.Component<toolProps>  {

toggleContainer =  React.createRef<HTMLDivElement>();

state = {
        isOpen: true,
    };

  constructor(props :any) {
    super(props);
    this.state = { isOpen: false };
    this.toggleContainer =  React.createRef();

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
  }
  
  onClickHandler  = (e:any) => {
      this.setState(state => {
        if (this.state.isOpen){
          return {
            isOpen: false
          };
        }
        else {
          return {
            isOpen: true
          };
        }

      });
    };

    componentDidMount() {
        document.addEventListener("mousedown", this.onClickOutsideHandler);
    }
    componentWillUnmount() {
      document.removeEventListener("mousedown", this.onClickOutsideHandler);
    }


    // onClickOutsideHandler(event : any ) {
    //   if (this.state.isOpen && !this.toggleContainer.current.contains(event.target)) {
    //     this.setState({ isOpen: false });
    //   }
    // }
  
    onClickOutsideHandler(event : any ) {
      if (this.state.isOpen && !this.toggleContainer.current) {
        this.setState({ isOpen: false });
      }
    }


    render() {


      return (

        <div className="flex-initial"  ref={this.toggleContainer}>
        
         {this.state.isOpen && (
          <div>
           { this.props.children}
          </div>
        )}

          <div>
          <button className={` ${this.props.className}`} onClick={this.onClickHandler}  >

     
      <i className=" fas fa-ellipsis-h"></i>

    </button>
    </div>

 </div>
      );
    }
  }