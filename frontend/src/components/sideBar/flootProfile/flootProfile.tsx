import React from 'react';



export class FlootProfile extends React.Component {

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

        <div className="mt-32 flex-initial"  ref={this.toggleContainer}>
        {/* <div className=" mt-32 flex-initial " > */}
         {this.state.isOpen && (
          <ul  className= "px-4">
          <a href="#" className=" mt-1 w-52 text-center block px-4 py-2 text-sm text-gray-700  hover:bg-gray-100 hover:text-gray-900  hover:rounded-full rounded-full" role="menuitem">My Account</a>
        <form method="" action="#">
         <button type="submit"  className=" block  w-52 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none  hover:rounded-full rounded-full" role="menuitem">
         Sign out
       </button>
      </form>
          </ul>
        )}

          <div>
          <button onClick={this.onClickHandler}  type="button" className=" absolute bottom-0 mb-2 rounded-full w-64  px-4 py-2
          bg-white hover:bg-blue-100 hover:rounded-full focus:bg-blue-200 focus:outline-none focus:shadow-outline hover:text-gray-900 focus:ring-2 
          focus:ring-offset-gray-100" id="options-menu">
    
    <i className=" fas fa-ellipsis-h"></i>
       </button>

    </div> 
 </div>
      );
    }
  }