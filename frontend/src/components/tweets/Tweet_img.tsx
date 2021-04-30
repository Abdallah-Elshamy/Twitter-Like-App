import './tweet.css';
import avatar from "../../routes/mjv-d5z8_400x400.jpg";

function Tweet_img(props:any){

  return(
<div className={`${props.className}`}>
   <a href ="/user_route" >
      {props.imageURL ? (
        <img src={props.imageURL}
          alt="avatar" />
      ) : (<img src={avatar} alt="avatar"/>)}
    </a>
    </div>
  )}

export default Tweet_img ;