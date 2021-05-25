import './tweet.css';
import avatar from "../../routes/mjv-d5z8_400x400.jpg";


function Tweet_img(props: any) {

  return (

    <a href="/user_route" className="tweet-icon mr-2">
      {props.imageURL ? (
        <img src={props.imageURL}
          alt="avatar" />
      ) : (<img src={avatar} alt="avatar" />)}
    </a>

  )
}

export default Tweet_img;