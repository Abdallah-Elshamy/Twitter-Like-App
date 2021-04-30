import './tweet.css';
import avatar from "../../routes/mjv-d5z8_400x400.jpg";
import { useHistory } from 'react-router';


function Tweet_img(props: any) {
  const history = useHistory();

  const goToProfile = () => {
    history.push({
      pathname: '/' + props.id,
    })
  }
  return (
    <p className={`${props.className}`}
    onClick={(e) => { goToProfile(); e.stopPropagation() }}>


      {props.imageURL ? (
        <img src={props.imageURL}
          alt="avatar" />
      ) : (<img src={avatar} alt="avatar" />)}
    </p>

  )
}

export default Tweet_img;